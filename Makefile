#! /usr/bin/make -f

DESTDIR ?= /tmp/mfw
# mfw Admin app
ADMIN_DIR ?= $(DESTDIR)/admin
# mfw resources dir which contains JS libs and images
STATIC_DIR ?= $(DESTDIR)/static
# mfw Setup app
SETUP_DIR ?= $(DESTDIR)/setup
# mfw stand-alone Settings app
SETTINGS_DIR ?= $(DESTDIR)/settings
# mfw stand-alone Reports app
REPORTS_DIR ?= $(DESTDIR)/reports



SASS := $(wildcard sass/*.scss)

# APPS SOURCES
APP_ADMIN_SRC := $(addprefix app/admin/src/, cmp *.js)
APP_SETTINGS_SRC := $(addprefix app/settings/src/, cmp *.js)
APP_COMMON_SRC := $(addprefix common/, conditions)

# PACKAGES SOURCES
PKG_DASHBOARD_SRC := $(addprefix package/dashboard/src/, conditions *.js)
PKG_SETTINGS_SRC := $(addprefix package/settings/src/, util model store component view *.js)
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
	$(shell find $(APP_SETTINGS_SRC) \
				 $(PKG_AUTH_SRC) \
				 $(PKG_SETTINGS_SRC) -name '*.js')

# RESOURCES
RESOURCES_VERSION := 0.1.0
RESOURCES_DIRECTORY := /tmp/mfw-resources
RESOURCES_FILE_NAME := mfw-admin-resources-$(RESOURCES_VERSION).tar.xz
RESOURCES_FILE := $(RESOURCES_DIRECTORY)/$(RESOURCES_FILE_NAME)
RESOURCES_URL := http://download.untangle.com/mfw/$(RESOURCES_FILE_NAME)
RESOURCES_BUCKET := s3://download.untangle.com/mfw/

install: \
	dir \
	css \
	js-admin \
	html-admin \
	js-settings \
	html-settings \
	html-reports \
	html-setup \
	resources

resources: dir
	wget -O - $(RESOURCES_URL) | tar -C $(STATIC_DIR) -xJf -

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


html-setup: $(SETUP_DIR)/index.html
$(SETUP_DIR)/index.html: app/setup/index.html
	cp $^ $@

html-reports: $(REPORTS_DIR)/index.html
$(REPORTS_DIR)/index.html: app/reports/index.html
	cp $^ $@



dir: $(DESTDIR)
$(DESTDIR):
	@mkdir -p $(DESTDIR) $(ADMIN_DIR) $(STATIC_DIR) $(SETUP_DIR) $(SETTINGS_DIR) $(REPORTS_DIR)

clean:
	rm -fr $(DESTDIR)

create-resources-tarball:
	@echo "Checking for $(RESOURCES_DIRECTORY)/res directory"
	@if [ ! -d $(RESOURCES_DIRECTORY)/res ] ; then echo "... failed" ; exit 1 ; fi
	@echo "Creating tarball from it"
	tar -C $(RESOURCES_DIRECTORY) -caf $(RESOURCES_FILE) res
	@echo "Your resources file is ready at $(RESOURCES_FILE)"

upload-resources-tarball:
	s3cmd put $(RESOURCES_FILE) $(RESOURCES_BUCKET)

.PHONY: \
	dir \
	css \
	js-admin \
	html-admin \
	js-settings \
	html-settings \
	html-reports \
	html-setup \
	resources


