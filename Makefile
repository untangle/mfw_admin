#! /usr/bin/make -f

DESTDIR ?= /tmp/mfw
DEV ?= false
DEV_HOST ?= sdwanbox
DEV_DIR ?= /www
VERSION ?= $(shell git describe --always --long --tags --dirty)

# logging
NC := "\033[0m" # no color
YELLOW := "\033[1;33m"
ifneq ($(DEV),false)
  GREEN := "\033[1;32m"
else
  GREEN :=
endif
LOG_FUNCTION = @/bin/echo -e $(shell date +%T.%3N) $(GREEN)$(1)$(NC)
WARN_FUNCTION = @/bin/echo -e $(shell date +%T.%3N) $(YELLOW)$(1)$(NC)

# mfw Admin app
ADMIN_DIR := $(DESTDIR)/admin
# mfw resources dir which contains JS libs and images
STATIC_DIR := $(DESTDIR)/static
# mfw Setup app
SETUP_DIR := $(DESTDIR)/setup
# mfw stand-alone Settings app
SETTINGS_DIR := $(DESTDIR)/settings
# mfw stand-alone Reports app
REPORTS_DIR := $(DESTDIR)/reports

# SASS-ADMIN
SASS-ADMIN := $(wildcard src/sass/*.scss)

# SASS-SETUP
SASS-SETUP := $(wildcard src/app/setup/sass/*.scss)


# APPS SOURCES
APP_ADMIN_SRC := $(addprefix src/app/admin/, cmp *.js)
APP_SETTINGS_SRC := $(addprefix src/app/settings/, cmp *.js)
APP_SETUP_SRC := $(addprefix src/app/setup/, Util.js components step view App.js)
APP_COMMON_SRC := $(addprefix src/common/, *js auth overrides conditions util validators store)

# PACKAGES SOURCES
PKG_DASHBOARD_SRC := $(addprefix src/package/dashboard/, *.js model store components widget)
PKG_SETTINGS_SRC := $(addprefix src/package/settings/, *.js model store component view)
PKG_REPORTS_SRC := $(addprefix src/package/reports/, conditions model store view *.js)
PKG_MONITOR_SRC := $(addprefix src/package/monitor/, model view *.js)

# APPS ALL SOURCES
APP_ADMIN_ALL := src/app/AppBase.js \
	$(shell find $(APP_COMMON_SRC) \
				 $(PKG_DASHBOARD_SRC) \
				 $(PKG_SETTINGS_SRC) \
				 $(PKG_REPORTS_SRC) \
				 $(PKG_MONITOR_SRC) \
				 $(APP_ADMIN_SRC) -name '*.js' 2>/dev/null)

APP_SETTINGS_ALL := src/app/AppBase.js \
	$(shell find $(APP_COMMON_SRC) \
				 $(APP_SETTINGS_SRC) \
				 $(PKG_AUTH_SRC) \
				 $(PKG_SETTINGS_SRC) -name '*.js' 2>/dev/null)

APP_SETUP_ALL := $(shell find $(APP_COMMON_SRC) \
				 $(APP_SETUP_SRC) -name '*.js' 2>/dev/null) \
				 src/package/settings/model/Interface.js \
				 src/package/settings/model/Account.js \
				 src/package/settings/store/Interfaces.js \
				 src/package/settings/store/Accounts.js \
				 src/package/settings/view/network/interface/* \
				 src/package/settings/view/network/Interface.js \

# All report entries
REPORT_ENTRIES = $(shell find reports/ -type f -name '*.json')

## External resources (ExtJS & Highcharts)

# common variables
DOWNLOADS_DIR := downloads
STAGING_DIR := staging
RESOURCES_BASE_URL := http://download.untangle.com/mfw

# common functions
LIST_FILES_FUNCTION = $(shell grep -vE '^\#' $(1) | while read line ; do echo -n " */$$line" ; done)
UNZIP_SUBSET_FUNCTION = @unzip -o $(1) $(call LIST_FILES_FUNCTION,$(2)) -d $(3)

# ExtJS
EXTJS_VERSION := 7.0.0
 # the folder name inside the archive which now seems to differ
EXTJS_FULL_VERSION := 7.0.0.156
EXTJS_ARCHIVE := ext-$(EXTJS_VERSION).zip
EXTJS_URL := $(RESOURCES_BASE_URL)/$(EXTJS_ARCHIVE)
EXTJS_FILE := $(DOWNLOADS_DIR)/$(EXTJS_ARCHIVE)
EXTJS_FILES_LIST := $(DOWNLOADS_DIR)/extjs-list.txt

# Highcharts
HIGHCHARTS_VERSION := 7.0.3
HIGHCHARTS_ARCHIVE := Highcharts-$(HIGHCHARTS_VERSION).zip
HIGHCHARTS_URL := $(RESOURCES_BASE_URL)/highcharts/$(HIGHCHARTS_VERSION)/$(HIGHCHARTS_ARCHIVE)
HIGHCHARTS_FILE := $(DOWNLOADS_DIR)/$(HIGHCHARTS_ARCHIVE)
HIGHCHARTS_FILES_LIST := $(DOWNLOADS_DIR)/highcharts-list.txt
HIGHCHARTS_MAP_MODULE_URL := $(RESOURCES_BASE_URL)/highcharts/$(HIGHCHARTS_VERSION)/map.js
HIGHCHARTS_MAP_DATA_URL := $(RESOURCES_BASE_URL)/highcharts/$(HIGHCHARTS_VERSION)/world.js

# MomentJS
MOMENT_ARCHIVE := moment.zip
MOMENT_URL := $(RESOURCES_BASE_URL)/$(MOMENT_ARCHIVE)
MOMENT_FILE := $(DOWNLOADS_DIR)/$(MOMENT_ARCHIVE)

# main targets
install: \
	dir \
	css-admin \
	js-admin \
	html-admin \
	css-settings \
	js-settings \
	html-settings \
	html-reports \
	css-setup \
	js-setup \
	html-setup \
	eula-setup \
	extjs-install \
	highcharts-install \
	moment-install \
	icons-install \
	reports-install \
	cacheguard

extjs-download: $(EXTJS_FILE)
$(EXTJS_FILE):
	$(call LOG_FUNCTION, "Downloading $(EXTJS_URL)...")
	wget -q -O $@ $(EXTJS_URL)

highcharts-download: $(HIGHCHARTS_FILE)
$(HIGHCHARTS_FILE):
	$(call LOG_FUNCTION, "Downloading $(HIGHCHARTS_URL)...")
	wget -q -O $@ $(HIGHCHARTS_URL)

highcharts-map-module-download: $(DOWNLOADS_DIR)/map.js
$(DOWNLOADS_DIR)/map.js:
	$(call LOG_FUNCTION, "Downloading $(HIGHCHARTS_MAP_MODULE_URL)...")
	wget -q -O $@ $(HIGHCHARTS_MAP_MODULE_URL)

highcharts-map-data-download: $(DOWNLOADS_DIR)/world.js
$(DOWNLOADS_DIR)/world.js:
	$(call LOG_FUNCTION, "Downloading $(HIGHCHARTS_MAP_DATA_URL)...")
	wget -q -O $@ $(HIGHCHARTS_MAP_DATA_URL)


moment-download: $(MOMENT_FILE)
$(MOMENT_FILE):
	$(call LOG_FUNCTION, "Downloading $(MOMENT_URL)...")
	wget -q -O $@ $(MOMENT_URL)

downloads: \
	extjs-download \
	highcharts-download \
	highcharts-map-module-download \
	highcharts-map-data-download \
	moment-download

extjs-stage: $(EXTJS_FILES_LIST) $(EXTJS_FILE)
	$(call UNZIP_SUBSET_FUNCTION,$(EXTJS_FILE),$(EXTJS_FILES_LIST),$(STAGING_DIR))

highcharts-stage: $(HIGHCHARTS_FILES_LIST) $(HIGHCHARTS_FILE)
	$(call UNZIP_SUBSET_FUNCTION,$(HIGHCHARTS_FILE),$(HIGHCHARTS_FILES_LIST),$(STAGING_DIR))

highcharts-map-module-stage: $(DOWNLOADS_DIR)/map.js
	cp -r $(DOWNLOADS_DIR)/map.js $(STAGING_DIR)/code/modules

highcharts-map-data-stage: $(DOWNLOADS_DIR)/world.js
	cp -r $(DOWNLOADS_DIR)/world.js $(STAGING_DIR)/code

moment-stage: $(MOMENT_FILE)
	@unzip -o $(MOMENT_FILE) -d $(STAGING_DIR)/moment

extjs-install: extjs-stage dir
	cp -r $(STAGING_DIR)/ext-$(EXTJS_FULL_VERSION)/build $(STATIC_DIR)/res/lib/ext

highcharts-install: highcharts-stage highcharts-map-module-stage highcharts-map-data-stage dir
	cp -r $(STAGING_DIR)/code $(STATIC_DIR)/res/lib/highcharts

moment-install: moment-stage dir
	cp -r $(STAGING_DIR)/moment $(STATIC_DIR)/res/lib/moment

icons-install: icons dir
	cp -r icons/* $(STATIC_DIR)/res/

${REPORTS_DIR}/entries.json: $(REPORT_ENTRIES)
	@echo "Building entries.json..."
	@echo "" > ${REPORTS_DIR}/entries.json
	@echo "[" >> ${REPORTS_DIR}/entries.json
	@pre=""
	for file in $(REPORT_ENTRIES) ; do \
		echo $${pre} >> ${REPORTS_DIR}/entries.json ; \
		cat $${file} >> ${REPORTS_DIR}/entries.json ; \
		pre="," ; \
	done
	@echo "\n]" >> ${REPORTS_DIR}/entries.json

reports-install: dir ${REPORTS_DIR}/entries.json

css-admin: $(ADMIN_DIR)/mfw-all.css
$(ADMIN_DIR)/mfw-all.css: src/css/mfw-all.css
	$(call LOG_FUNCTION,"Building CSS")
	@cp $^ $@

js-admin: $(ADMIN_DIR)/mfw-admin-all.js
$(ADMIN_DIR)/mfw-admin-all.js: $(APP_ADMIN_ALL)
	$(call LOG_FUNCTION,"Building Admin app")
	@cat $^ > $@

# minify target (not used in build yet)
js-admin-min:
	$(call LOG_FUNCTION,"Minifying Admin app")
	@java -jar closure-compiler.jar --js ${ADMIN_DIR}/mfw-admin-all.js --js_output_file ${ADMIN_DIR}/mfw-admin-all.min.js

html-admin: $(ADMIN_DIR)/index.html
$(ADMIN_DIR)/index.html: src/app/admin/index.html
	$(call LOG_FUNCTION,"Building Admin HTML")
	@cp $^ $@

css-settings: $(SETTINGS_DIR)/mfw-all.css
$(SETTINGS_DIR)/mfw-all.css: src/css/mfw-all.css
	$(call LOG_FUNCTION,"Building CSS")
	@cp $^ $@

js-settings: $(SETTINGS_DIR)/mfw-settings-all.js
$(SETTINGS_DIR)/mfw-settings-all.js: $(APP_SETTINGS_ALL)
	$(call LOG_FUNCTION,"Building Settings app")
	@cat $^ > $@

html-settings: $(SETTINGS_DIR)/index.html
$(SETTINGS_DIR)/index.html: src/app/settings/index.html
	$(call LOG_FUNCTION,"Building Settings HTML")
	@cp $^ $@

css-setup: $(SETUP_DIR)/mfw-setup.css
$(SETUP_DIR)/mfw-setup.css: src/css/mfw-setup.css
	$(call LOG_FUNCTION,"Building CSS")
	@cp $^ $@

js-setup: $(SETUP_DIR)/mfw-setup-all.js
$(SETUP_DIR)/mfw-setup-all.js: $(APP_SETUP_ALL)
	$(call LOG_FUNCTION,"Building Setup app")
	@cat $^ > $@

html-setup: $(SETUP_DIR)/index.html
$(SETUP_DIR)/index.html: src/app/setup/index.html
	$(call LOG_FUNCTION,"Building Setup HTML")
	@cp $^ $@

eula-setup: $(SETUP_DIR)/eula.html
$(SETUP_DIR)/eula.html: src/app/setup/eula.html
	$(call LOG_FUNCTION,"Building Setup EULA")
	@cp $^ $@

html-reports: $(REPORTS_DIR)/index.html
$(REPORTS_DIR)/index.html: src/app/reports/index.html
	$(call LOG_FUNCTION,"Building Reports HTML")
	@cp $^ $@

dir: $(DESTDIR)
$(DESTDIR):
	$(call LOG_FUNCTION,"Creating directories")
	@mkdir -p $(DESTDIR) $(ADMIN_DIR) $(STATIC_DIR)/res/lib $(SETUP_DIR) $(SETTINGS_DIR) $(REPORTS_DIR)

cacheguard: dir
	$(call LOG_FUNCTION,"Versioning with $(VERSION)")
	@find $(DESTDIR) -type f | xargs sed -i -e 's/<CACHEGUARD>/version='$(VERSION)'/g'

clean:
	rm -fr $(DESTDIR) $(STAGING_DIR) $(DOWNLOADS_DIR)/$(EXTJS_ARCHIVE) $(DOWNLOADS_DIR)/$(HIGHCHARTS_ARCHIVE) $(DOWNLOADS_DIR)/map.js $(DOWNLOADS_DIR)/world.js $(DOWNLOADS_DIR)/$(MOMENT_ARCHIVE)

## development targets

dev-deploy: dev-install dev-copy

dev-install: \
	dir \
	js-admin \
	html-admin \
	js-settings \
	html-settings \
	html-reports \
	js-setup \
	html-setup \
	eula-setup \
	dev-sass-admin \
	dev-sass-setup \
	css-admin \
	css-setup \
	css-settings \
	cacheguard

# generates the mfw-all.css
dev-sass-admin: src/css/mfw-all.css
src/css/mfw-all.css: $(SASS-ADMIN)
	$(call LOG_FUNCTION,"Building Dev CSS")
	cat $^ | sass --scss --style compact --sourcemap=none -s $@

# generates the mfw-setup.css
dev-sass-setup: src/css/mfw-setup.css
src/css/mfw-setup.css: $(SASS-SETUP)
	$(call LOG_FUNCTION,"Building Dev CSS")
	cat $^ | sass --scss --style compact --sourcemap=none -s $@


dev-copy:
	@echo "****************************************"
	$(call LOG_FUNCTION,"Deploying to $(DEV_HOST)"$(NC))
	@scp -r $(DESTDIR)/admin/* root@$(DEV_HOST):$(DEV_DIR)/admin
	@scp -r $(DESTDIR)/setup/* root@$(DEV_HOST):$(DEV_DIR)/setup
	@scp -r $(DESTDIR)/reports/entries.json root@$(DEV_HOST):$(DEV_DIR)/reports
	@echo "****************************************"

dev-reload:
	@bash reload.sh

dev-watch:
	$(call WARN_FUNCTION,"Waiting for changes...")
	@while inotifywait -qr -e modify -e create -e delete -e move src reports; do \
	  $(MAKE) DEV=$(DEV) reports-install dev-deploy dev-reload; \
	done

# phony targets
.PHONY: dir \
	css \
	js-admin \
	html-admin \
	js-settings \
	html-settings \
	html-reports \
	js-setup \
	html-setup \
	eula-setup \
	cacheguard \
	resources \
	extjs-download \
	highcharts-download \
	downloads \
	extjs-stage \
	highcharts-stage \
	extjs-install \
	highcharts-install \
	moment-install \
	dev-deploy \
	dev-install \
	dev-sass-admin \
	dev-copy \
	dev-reload \
	dev-watch
