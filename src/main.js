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
 * If not, see <https://www.gnu.org/licenses/>.
 */
(function(){
	const resolution = 1600;

	var canvas, ctx;
	var outline;

	let fillRect = function(x, y, w, h, colour) {
		if(colour !== null) ctx.fillStyle = colour;

		x = Math.floor(x);
		y = Math.floor(y);

		w = (w !== null) ? Math.floor(w) : resolution;
		h = (h !== null) ? Math.floor(h) : resolution;

		ctx.fillRect(x, y, w, h);
	}

	let resize = function() {
		let width = window.innerWidth;
		let height = window.innerHeight;

		let size = (width < height) ? width : height;
		let cssSize = size + "px";

		let cssTop = ((height - size) / 2) + "px";
		let cssLeft = ((width - size) / 2) + "px";

		let resizeElem = function(elem) {
			elem.style["top"] = cssTop;
			elem.style["left"] = cssLeft;
			elem.style["width"] = canvas.style["height"] = cssSize;
		};
		resizeElem(canvas);
		resizeElem(outline);
	};

	let init = function(){
		canvas = document.createElement("canvas");
		canvas.id = "LD46-canvas";
		canvas.width = canvas.height = resolution;

		ctx = canvas.getContext("2d", { "alpha": true });
		ctx.save();
		fillRect(0, 0, null, null, "white");

		outline = document.createElement("img");
		outline.id = "LD46-outline";
		outline.src = "border-3600.png";

		resize();
		window.addEventListener('resize', resize);

		document.body.appendChild(canvas);
		document.body.appendChild(outline);
	};

	window.addEventListener('load', function(){
		init();
	});
})();
