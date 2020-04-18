# Makefile for LD46
# Copyright (C) 2020 Artur "suve" Iwicki
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License, version 3,
# as published by the Free Software Foundation.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program (LICENCE-AGPL-v3.txt).
# If not, see <https://www.gnu.org/licenses/>.

BROWSER ?= firefox

PNG_SOURCES := $(shell ls gfx/*.png)
PNG_TARGETS := $(PNG_SOURCES:gfx/%.png=build/%.png)

JS_SOURCES := $(shell ls src/*.js)

# -- variables end
# -- .PHONY start

.PHONY = all assets clean run

all: assets build/index.html build/code.js build/style.css

assets: $(PNG_TARGETS)

run: all
	$(BROWSER) build/index.html

clean:
	rm -rf build/

# -- .PHONY end
# -- file targets start

build/index.html: src/index.html
	mkdir -p build/
	cp -a "$<" "$@"

build/style.css: src/style.css
	mkdir -p build/
	python3 -mrcssmin < "$<" > "$@"

build/code.js: $(JS_SOURCES)
	mkdir -p build/
	cat /dev/null $^ | python3 -mrjsmin > "$@"

build/%.png: gfx/%.png
	mkdir -p build/
	optipng -out "$@" -quiet -clobber "$<"
