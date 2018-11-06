#! /usr/bin/make -f

DESTDIR ?= dist
ADMINDIR ?= $(DESTDIR)/admin
STATICDIR ?= $(DESTDIR)/static

SASS := $(wildcard sass/*.scss)

JS_UTIL := $(shell find app/util -name '*.js')
JS_CMP := $(shell find app/cmp -name '*.js')
JS_MODEL := $(shell find app/model -name '*.js')
JS_STORE := $(shell find app/store -name '*.js')
JS_VIEW := $(shell find app/view -name '*.js')
JS_SETTINGS := $(shell find app/settings -name '*.js')
JS_APP := app/AppController.js app/App.js

RESOURCES_VERSION := 0.1.0
RESOURCES_DIRECTORY := /tmp/mfw-resources
RESOURCES_FILE_NAME := mfw-admin-resources-$(RESOURCES_VERSION).tar.xz
RESOURCES_FILE := $(RESOURCES_DIRECTORY)/$(RESOURCES_FILE_NAME)
RESOURCES_URL := http://download.untangle.com/mfw/$(RESOURCES_FILE_NAME)
RESOURCES_BUCKET := s3://download.untangle.com/mfw/

install: dir css js html resources

resources: dir
	wget -O - $(RESOURCES_URL) | tar -C $(STATICDIR) -xJf -

html: $(ADMINDIR)/index.html
$(ADMINDIR)/index.html: index.html
	cp $^ $@

css: $(ADMINDIR)/mfw-all.css
$(ADMINDIR)/mfw-all.css: sass/mfw-all.css
	cp $^ $@

sass/mfw-all.css: $(SASS)
	cat $^ | sass --sourcemap=none --no-cache --scss --style normal --stdin $@

js: $(ADMINDIR)/mfw-all.js
$(ADMINDIR)/mfw-all.js: $(JS_UTIL) $(JS_CMP) $(JS_MODEL) $(JS_STORE) $(JS_VIEW) $(JS_SETTINGS) $(JS_APP)
	cat $^ > $@

dir: $(DESTDIR)
$(DESTDIR):
	mkdir -p $(DESTDIR) $(ADMINDIR) $(STATICDIR)

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
