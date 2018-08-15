#! /usr/bin/make -f

DESTDIR ?= /tmp/mfw-admin

SASS := $(wildcard sass/*.scss)

JS_UTIL := $(wildcard app/util/*.js)
JS_CMP := $(wildcard app/cmp/nav/*.js app/cmp/condition/*.js  app/cmp/nav/*.js)
JS_MODEL := $(wildcard app/model/*.js)
JS_VIEW := $(wildcard app/view/settings/*.js app/view/monitor/*.js app/view/reports/*.js app/view/dashboard/*.js app/view/*.js)
JS_SETTINGS := $(wildcard app/settings/network/*.js app/settings/system/*.js)
JS_APP := ./app/AppController.js ./app/App.js

install: dir css js

css: $(DESTDIR)/mfw-all.css
# $(DESTDIR)/mfw-all.css: $(SASS)
# 	cat $^ | sass --sourcemap=none --no-cache --scss --style normal --stdin $@
$(DESTDIR)/mfw-all.css: sass/mfw-all.css
	cp $^ $@

js: $(DESTDIR)/mfw-all.js
$(DESTDIR)/mfw-all.js: $(JS_UTIL) $(JS_CMP) $(JS_MODEL) $(JS_STORE) $(JS_VIEW) $(JS_SETTINGS) $(JS_APP)
	cat $^ > $@

dir: $(DESTDIR)
$(DESTDIR):
	mkdir -p $(DESTDIR)

clean:
	echo rm -fr $(DESTDIR)

.PHONY: css js dir
