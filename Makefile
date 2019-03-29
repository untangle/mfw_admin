#! /usr/bin/make -f

DESTDIR ?= /tmp/mfw
DEV ?= false
DEV_HOST ?= sdwan
DEV_DIR ?= /www

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

# SASS
SASS := $(wildcard src/sass/*.scss)

# APPS SOURCES
APP_ADMIN_SRC := $(addprefix src/app/admin/, cmp *.js)
APP_SETTINGS_SRC := $(addprefix src/app/settings/, cmp *.js)
APP_SETUP_SRC := $(addprefix src/app/setup/, *.js model store step view)
APP_COMMON_SRC := $(addprefix src/common/, *js auth overrides conditions util)

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

APP_SETUP_ALL := src/app/AppBase.js $(shell find $(APP_COMMON_SRC) $(APP_SETUP_SRC) -name '*.js' 2>/dev/null)

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
EXTJS_VERSION := 6.7.0
 # the folder name inside the archive which now seems to differ
EXTJS_FULL_VERSION := 6.7.0.161
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
	css \
	js-admin \
	html-admin \
	js-settings \
	html-settings \
	html-reports \
	js-setup \
	html-setup \
	extjs-install \
	highcharts-install \
	moment-install \
	icons-install \
	reports-install

extjs-download: $(EXTJS_FILE)
$(EXTJS_FILE):
	wget -q -O $@ $(EXTJS_URL)

highcharts-download: $(HIGHCHARTS_FILE)
$(HIGHCHARTS_FILE):
	wget -q -O $@ $(HIGHCHARTS_URL)

highcharts-map-module-download: $(DOWNLOADS_DIR)/map.js
$(DOWNLOADS_DIR)/map.js:
	wget -q -O $@ $(HIGHCHARTS_MAP_MODULE_URL)

highcharts-map-data-download: $(DOWNLOADS_DIR)/world.js
$(DOWNLOADS_DIR)/world.js:
	wget -q -O $@ $(HIGHCHARTS_MAP_DATA_URL)


moment-download: $(MOMENT_FILE)
$(MOMENT_FILE):
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

css: $(ADMIN_DIR)/mfw-all.css
$(ADMIN_DIR)/mfw-all.css: src/css/mfw-all.css
	$(call LOG_FUNCTION,"Building CSS")
	@cp $^ $@

js-admin: $(ADMIN_DIR)/mfw-admin-all.js
$(ADMIN_DIR)/mfw-admin-all.js: $(APP_ADMIN_ALL)
	$(call LOG_FUNCTION,"Building Admin app")
	@cat $^ > $@

html-admin: $(ADMIN_DIR)/index.html
$(ADMIN_DIR)/index.html: src/app/admin/index.html
	$(call LOG_FUNCTION,"Building Admin HTML")
	@cp $^ $@

js-settings: $(SETTINGS_DIR)/mfw-settings-all.js
$(SETTINGS_DIR)/mfw-settings-all.js: $(APP_SETTINGS_ALL)
	$(call LOG_FUNCTION,"Building Settings app")
	@cat $^ > $@

html-settings: $(SETTINGS_DIR)/index.html
$(SETTINGS_DIR)/index.html: src/app/settings/index.html
	$(call LOG_FUNCTION,"Building Settings HTML")
	@cp $^ $@

js-setup: $(SETUP_DIR)/mfw-setup-all.js
$(SETUP_DIR)/mfw-setup-all.js: $(APP_SETUP_ALL)
	$(call LOG_FUNCTION,"Building Setup app")
	@cat $^ > $@

html-setup: $(SETUP_DIR)/index.html
$(SETUP_DIR)/index.html: src/app/setup/index.html
	$(call LOG_FUNCTION,"Building Setup HTML")
	@cp $^ $@

html-reports: $(REPORTS_DIR)/index.html
$(REPORTS_DIR)/index.html: src/app/reports/index.html
	$(call LOG_FUNCTION,"Building Reports HTML")
	@cp $^ $@

dir: $(DESTDIR)
$(DESTDIR):
	$(call LOG_FUNCTION,"Creating directories")
	@mkdir -p $(DESTDIR) $(ADMIN_DIR) $(STATIC_DIR)/res/lib $(SETUP_DIR) $(SETTINGS_DIR) $(REPORTS_DIR)

clean:
	rm -fr $(DESTDIR) $(STAGING_DIR)

## development targets

dev-deploy: dev-install dev-sass css dev-copy

dev-install: \
	dir \
	js-admin \
	html-admin \
	js-settings \
	html-settings \
	html-reports \
	js-setup \
	html-setup \
	dev-sass \
	css

# generates the mfw-all.css
dev-sass: src/css/mfw-all.css
src/css/mfw-all.css: $(SASS)
	$(call LOG_FUNCTION,"Building Dev CSS")
	cat $^ | sass --scss --style compact --sourcemap=none -s $@

dev-copy:
	@echo "****************************************"
	$(call LOG_FUNCTION,"Deploying to $(DEV_HOST)"$(NC))
	@scp -r $(DESTDIR)/* root@$(DEV_HOST):$(DEV_DIR)
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
	dev-sass \
	dev-copy \
	dev-reload \
	dev-watch
