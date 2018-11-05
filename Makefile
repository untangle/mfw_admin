#! /usr/bin/make -f

# Currently everything is deployed in /www/admin
# This file will change when building will be made just in /www, allowing multiple apps

DESTDIR ?= dist
ADMINDIR ?= $(DESTDIR)/admin
SETTINGSDIR ?= $(ADMINDIR)/settings

SASS := $(wildcard sass/*.scss)

# APPS SOURCES
APP_ADMIN_SRC := $(addprefix app/admin/src/, cmp view) app/admin/src
APP_SETTINGS_SRC := $(addprefix app/settings/src/, cmp) app/settings/src

# PACKAGES SOURCES
PKG_SETTINGS_SRC := $(addprefix package/settings/src/, util model store component view) package/settings/src
PKG_REPORTS_SRC := $(addprefix package/reports/src/, model store) package/reports/src
PKG_AUTH_SRC := package/auth

# APPS ALL SOURCES
APP_ADMIN_ALL := app/AppBase.js $(shell find $(APP_ADMIN_SRC) $(PKG_AUTH_SRC) $(PKG_SETTINGS_SRC) $(PKG_REPORTS_SRC) -name '*.js')
APP_SETTINGS_ALL := app/AppBase.js $(shell find $(APP_SETTINGS_SRC) $(PKG_AUTH_SRC) $(PKG_SETTINGS_SRC) -name '*.js')

# RESOURCES
RESOURCES_VERSION := 0.1.0
RESOURCES_DIRECTORY := /tmp/mfw-resources
RESOURCES_FILE_NAME := mfw-admin-resources-$(RESOURCES_VERSION).tar.xz
RESOURCES_FILE := $(RESOURCES_DIRECTORY)/$(RESOURCES_FILE_NAME)
RESOURCES_URL := http://download.untangle.com/mfw/$(RESOURCES_FILE_NAME)
RESOURCES_BUCKET := s3://download.untangle.com/mfw/


install: dir css js-admin html-admin js-settings html-settings

resources: dir
	wget -O - $(RESOURCES_URL) | tar -C $(DESTDIR) -xJf -

#  This target requires sassc package!!!
css: $(ADMINDIR)/mfw-all.css
$(ADMINDIR)/mfw-all.css: $(SASS)
	cat $^ | sassc --style expanded --stdin $@


js-admin: $(ADMINDIR)/mfw-admin-all.js
$(ADMINDIR)/mfw-admin-all.js: $(APP_ADMIN_ALL)
	cat $^ > $@

html-admin: $(ADMINDIR)/index.html
$(ADMINDIR)/index.html: app/admin/index.html
	cp $^ $@

js-settings: $(SETTINGSDIR)/mfw-settings-all.js
$(SETTINGSDIR)/mfw-settings-all.js: $(APP_SETTINGS_ALL)
	cat $^ > $@

html-settings: $(SETTINGSDIR)/index.html
$(SETTINGSDIR)/index.html: app/settings/index.html
	cp $^ $@


dir: $(DESTDIR)
$(DESTDIR):
	mkdir -p $(DESTDIR) $(ADMINDIR) $(SETTINGSDIR)

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

.PHONY: css js dir html resources



# used for local development
LOCAT_DEPLOY_HOST := 192.168.101.233
copy:
	scp -r $(ADMINDIR)/* root@$(LOCAT_DEPLOY_HOST):/www/admin

deploy: install copy


.PHONY: dir css js-admin html-admin js-settings html-settings resources
