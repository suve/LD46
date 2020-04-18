/**
 * This file is part of LD46.
 * Copyright (C) 2020 Artur "suve" Iwicki
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License, version 3,
 * as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program (LICENCE-AGPL-v3.txt).
 * If not, see <http://www.gnu.org/licenses/>.
 */
const ARROW_LEFT = 37;
const ARROW_UP = 38;
const ARROW_RIGHT = 39;
const ARROW_DOWN = 40;

function __input() {
	let self = this;

	this.keyState = [];
	this.keyState[ARROW_LEFT ] = 0;
	this.keyState[ARROW_UP   ] = 0;
	this.keyState[ARROW_RIGHT] = 0;
	this.keyState[ARROW_DOWN ] = 0;

	let keycode = function(ev){
		let k = ev.keyCode;

		// Do not preventDefault on F-keys (interferes with refreshing and opening the dev tools)
		if(k < 112 || k > 123) ev.preventDefault();

		return k;
	}

	let handleKeyDown = function(k) {
		k = keycode(k);
		self.keyState[k] = true;
	}

	let handleKeyUp = function(k) {
		k = keycode(k);
		self.keyState[k] = false;
	}

	document.addEventListener("keydown", handleKeyDown);
	document.addEventListener("keyup", handleKeyUp);
}
