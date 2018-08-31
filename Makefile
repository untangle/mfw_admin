#! /usr/bin/make -f

DESTDIR ?= /tmp/mfw-admin

SASS := $(wildcard sass/*.scss)

JS_UTIL := $(wildcard app/util/*.js)
JS_CMP := $(wildcard app/cmp/nav/*.js app/cmp/condition/*.js  app/cmp/dialog/*.js app/cmp/grid/*.js)
JS_MODEL := $(wildcard app/model/*.js)
JS_STORE := $(wildcard app/store/*.js)
JS_VIEW := $(wildcard app/view/settings/*.js app/view/monitor/*.js app/view/reports/*.js app/view/dashboard/*.js app/view/*.js)
JS_SETTINGS := $(wildcard app/settings/network/*.js app/settings/system/*.js)
JS_APP := ./app/AppController.js ./app/App.js

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

.PHONY: css js dir html resources
