#! /usr/bin/make -f

DESTDIR ?= /tmp/mfw

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
SASS := $(wildcard sass/*.scss)

# APPS SOURCES
APP_ADMIN_SRC := $(addprefix app/admin/src/, cmp *.js)
APP_SETTINGS_SRC := $(addprefix app/settings/src/, cmp *.js)
APP_SETUP_SRC := $(addprefix app/setup/src/, model store step view *.js)
APP_COMMON_SRC := $(addprefix common/, conditions util)

# PACKAGES SOURCES
PKG_DASHBOARD_SRC := $(addprefix package/dashboard/src/, conditions *.js)
PKG_SETTINGS_SRC := $(addprefix package/settings/src/, model store component view *.js)
PKG_REPORTS_SRC := $(addprefix package/reports/src/, conditions model store *.js)
PKG_AUTH_SRC := package/auth

# APPS ALL SOURCES
APP_ADMIN_ALL := app/AppBase.js \
	$(shell find $(APP_COMMON_SRC) \
				 $(PKG_AUTH_SRC) \
				 $(PKG_DASHBOARD_SRC) \
				 $(PKG_SETTINGS_SRC) \
				 $(PKG_REPORTS_SRC) \
				 $(APP_ADMIN_SRC) -name '*.js')

APP_SETTINGS_ALL := app/AppBase.js \
	$(shell find $(APP_COMMON_SRC) \
				 $(APP_SETTINGS_SRC) \
				 $(PKG_AUTH_SRC) \
				 $(PKG_SETTINGS_SRC) -name '*.js')

APP_SETUP_ALL := $(shell find $(APP_COMMON_SRC) $(APP_SETUP_SRC) -name '*.js')

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
	icons-install

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

css: $(ADMIN_DIR)/mfw-all.css
$(ADMIN_DIR)/mfw-all.css: sass/mfw-all.css
	cp $^ $@

sass/mfw-all.css: $(SASS)
	cat $^ | sass --sourcemap=none --no-cache --scss --style normal --stdin $@

js-admin: $(ADMIN_DIR)/mfw-admin-all.js
$(ADMIN_DIR)/mfw-admin-all.js: $(APP_ADMIN_ALL)
	cat $^ > $@

html-admin: $(ADMIN_DIR)/index.html
$(ADMIN_DIR)/index.html: app/admin/index.html
	cp $^ $@

js-settings: $(SETTINGS_DIR)/mfw-settings-all.js
$(SETTINGS_DIR)/mfw-settings-all.js: $(APP_SETTINGS_ALL)
	cat $^ > $@

html-settings: $(SETTINGS_DIR)/index.html
$(SETTINGS_DIR)/index.html: app/settings/index.html
	cp $^ $@

js-setup: $(SETUP_DIR)/mfw-setup-all.js
$(SETUP_DIR)/mfw-setup-all.js: $(APP_SETUP_ALL)
	cat $^ > $@

html-setup: $(SETUP_DIR)/index.html
$(SETUP_DIR)/index.html: app/setup/index.html
	cp $^ $@

html-reports: $(REPORTS_DIR)/index.html
$(REPORTS_DIR)/index.html: app/reports/index.html
	cp $^ $@



dir: $(DESTDIR)
$(DESTDIR):
	@mkdir -p $(DESTDIR) $(ADMIN_DIR) $(STATIC_DIR)/res/lib $(SETUP_DIR) $(SETTINGS_DIR) $(REPORTS_DIR)

clean:
	rm -fr $(DESTDIR) $(STAGING_DIR)

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
	highstock-install
