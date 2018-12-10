#! /usr/bin/make -f

DESTDIR ?= /tmp/mfw
DEV ?= false
DEV_HOST ?= 192.168.101.35
DEV_DIR ?= /www

# logging
NC := "\033[0m" # no color
YELLOW := "\033[1;33m"
ifneq ($(DEV),false)
  GREEN := "\033[1;32m"
else
  GREEN :=
endif
LOG_FUNCTION = @echo -e $(shell date +%T.%3N) $(GREEN)$(1)$(NC)
WARN_FUNCTION = @echo -e $(shell date +%T.%3N) $(YELLOW)$(1)$(NC)

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
APP_SETUP_SRC := $(addprefix src/app/setup/, model store step view *.js)
APP_COMMON_SRC := $(addprefix src/common/, *js auth overrides conditions util)

# PACKAGES SOURCES
PKG_DASHBOARD_SRC := $(addprefix src/package/dashboard/, conditions *.js)
PKG_SETTINGS_SRC := $(addprefix src/package/settings/, *.js model store component view)
PKG_REPORTS_SRC := $(addprefix src/package/reports/, conditions model store view *.js)

# APPS ALL SOURCES
APP_ADMIN_ALL := src/app/AppBase.js \
	$(shell find $(APP_COMMON_SRC) \
				 $(PKG_DASHBOARD_SRC) \
				 $(PKG_SETTINGS_SRC) \
				 $(PKG_REPORTS_SRC) \
				 $(APP_ADMIN_SRC) -name '*.js' 2>/dev/null)

APP_SETTINGS_ALL := src/app/AppBase.js \
	$(shell find $(APP_COMMON_SRC) \
				 $(APP_SETTINGS_SRC) \
				 $(PKG_AUTH_SRC) \
				 $(PKG_SETTINGS_SRC) -name '*.js' 2>/dev/null)

APP_SETUP_ALL := src/app/AppBase.js $(shell find $(APP_COMMON_SRC) $(APP_SETUP_SRC) -name '*.js' 2>/dev/null)

## External resources (ExtJS & Highstock)

# common variables
DOWNLOADS_DIR := downloads
STAGING_DIR := staging
RESOURCES_BASE_URL := http://download.untangle.com/mfw

# common functions
LIST_FILES_FUNCTION = $(shell grep -vE '^\#' $(1) | while read line ; do echo -n " */$$line" ; done)
UNZIP_SUBSET_FUNCTION = @unzip -o $(1) $(call LIST_FILES_FUNCTION,$(2)) -d $(3)

# ExtJS
EXTJS_VERSION := 6.6.0
EXTJS_ARCHIVE := ext-$(EXTJS_VERSION).zip
EXTJS_URL := $(RESOURCES_BASE_URL)/$(EXTJS_ARCHIVE)
EXTJS_FILE := $(DOWNLOADS_DIR)/$(EXTJS_ARCHIVE)
EXTJS_FILES_LIST := $(DOWNLOADS_DIR)/extjs-list.txt

# Highstock
HIGHSTOCK_VERSION := 6.1.4
HIGHSTOCK_ARCHIVE := Highstock-$(HIGHSTOCK_VERSION).zip
HIGHSTOCK_URL := $(RESOURCES_BASE_URL)/$(HIGHSTOCK_ARCHIVE)
HIGHSTOCK_FILE := $(DOWNLOADS_DIR)/$(HIGHSTOCK_ARCHIVE)
HIGHSTOCK_FILES_LIST := $(DOWNLOADS_DIR)/highstock-list.txt

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
	highstock-install \
	icons-install \
	reports-install

extjs-download: $(EXTJS_FILE)
$(EXTJS_FILE):
	wget -O $@ $(EXTJS_URL)

highstock-download: $(HIGHSTOCK_FILE)
$(HIGHSTOCK_FILE):
	wget -O $@ $(HIGHSTOCK_URL)

downloads: extjs-download highstock-download

extjs-stage: $(EXTJS_FILES_LIST) $(EXTJS_FILE)
	$(call UNZIP_SUBSET_FUNCTION,$(EXTJS_FILE),$(EXTJS_FILES_LIST),$(STAGING_DIR))

highstock-stage: $(HIGHSTOCK_FILES_LIST) $(HIGHSTOCK_FILE)
	$(call UNZIP_SUBSET_FUNCTION,$(HIGHSTOCK_FILE),$(HIGHSTOCK_FILES_LIST),$(STAGING_DIR))

extjs-install: extjs-stage dir
	cp -r $(STAGING_DIR)/ext-$(EXTJS_VERSION)/build $(STATIC_DIR)/res/lib/ext

highstock-install: highstock-stage dir
	cp -r $(STAGING_DIR)/code $(STATIC_DIR)/res/lib/highstock

icons-install: icons dir
	cp -r icons/* $(STATIC_DIR)/res/

${REPORTS_DIR}/entries.json: reports/*
	@echo "Building entries.json..."
	@echo "" > ${REPORTS_DIR}/entries.json
	@echo "[" >> ${REPORTS_DIR}/entries.json
	@pre=""
	@for file in reports/* ; do \
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
	highstock-download \
	downloads \
	extjs-stage \
	highstock-stage \
	extjs-install \
	highstock-install \
	dev-deploy \
	dev-install \
	dev-sass \
	dev-copy \
	dev-reload \
	dev-watch
