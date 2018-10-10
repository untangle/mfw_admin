#! /usr/bin/make -f

DESTDIR ?= /tmp/mfw-admin

SASS := $(wildcard sass/*.scss)

JS_UTIL := $(shell find app/util -name '*.js')
JS_CMP := $(shell find app/cmp -name '*.js')
JS_MODEL := $(shell find app/model -name '*.js')
JS_STORE := $(shell find app/store -name '*.js')
JS_VIEW := $(shell find app/view -name '*.js')
JS_SETTINGS := $(shell find app/settings -name '*.js')
JS_APP := app/AppController.js app/App.js

RESOURCES_FILE := mfw-admin-resources.tar.xz
RESOURCES_URL := http://download.untangle.com/mfw/$(RESOURCES_FILE)

install: dir css js html resources

resources: dir
	wget -O - $(RESOURCES_URL) | tar -C $(DESTDIR) -xJf -

html: $(DESTDIR)/index.html
$(DESTDIR)/index.html: index.html
	cp $^ $@

css: $(DESTDIR)/mfw-all.css
$(DESTDIR)/mfw-all.css: sass/mfw-all.css
	cp $^ $@

sass/mfw-all.css: $(SASS)
	cat $^ | sass --sourcemap=none --no-cache --scss --style normal --stdin $@

js: $(DESTDIR)/mfw-all.js
$(DESTDIR)/mfw-all.js: $(JS_UTIL) $(JS_CMP) $(JS_MODEL) $(JS_STORE) $(JS_VIEW) $(JS_SETTINGS) $(JS_APP)
	cat $^ > $@

dir: $(DESTDIR)
$(DESTDIR):
	mkdir -p $(DESTDIR)

clean:
	rm -fr $(DESTDIR)

# FIXME: provide an extra target to upload static resources to s3


.PHONY: css js dir html resources
