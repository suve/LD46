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
	let init = function(){
		let canvas, outline;
		function resize() {
			const aspectRatio = 1.0;

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
		}

		canvas = document.createElement("div");
		canvas.id = "LD46-canvas";
		canvas.style["background-color"] = "white";

		outline = document.createElement("img");
		outline.id = "LD46-outline";
		outline.src = "border-3600.png";

		resize();
		window.addEventListener('resize', resize);

		document.body.appendChild(canvas);
		document.body.appendChild(outline);
	}

	window.addEventListener('load', function(){
		init();
	});
})();
