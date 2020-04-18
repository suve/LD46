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
	const CYCLES_PER_SECOND = 50;
	const CYCLE_TICKS = Math.floor(1000 / CYCLES_PER_SECOND);

	const resolution = 1600;

	var appstart;
	var canvas, ctx;
	var mainLoopTicks;
	var outline;
	var zing, zzing;

	let getTicks = function() {
		var d = new Date();
		return d.getTime() - appstart;
	};

	let fillRect = function(x, y, w, h, colour) {
		if(colour !== null) ctx.fillStyle = colour;

		x = Math.floor(x);
		y = Math.floor(y);

		w = (w !== null) ? Math.floor(w) : resolution;
		h = (h !== null) ? Math.floor(h) : resolution;

		ctx.fillRect(x, y, w, h);
	};

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

	let drawFrame = function() {
		fillRect(0, 0, null, null, "white");

		let offset = Math.floor(getTicks() / 4);

		let terrain = [0, 1, 0, 3, 2, 5, 2, 1, 0, 3, 0, 1, 0, 3, 2, 5, 2, 1, 0, 3];
		for(let i = 0; i < terrain.length; ++i) {
			let t = terrain[i];
			ctx.drawImage(zzing, (t % 2) * 550, Math.floor(t / 2) * 550, 550, 550, i * 400 - offset, (resolution - 400) / 2, 400, 400);
		}

		let frame = Math.floor(getTicks() / 250) % 4;
		ctx.drawImage(zing, 0, frame * 550, 550, 550, (resolution - 400) / 2, (resolution - 400) / 2, 400, 400);
	};

	let gameLogic = function() {

	};

	let mainLoop = function() {
		let ticks = getTicks() - mainLoopTicks;
		let cycles = Math.floor(ticks / CYCLE_TICKS);

		for(let i = 0; i < cycles; ++i) {
			gameLogic();
			drawFrame();

			mainLoopTicks += cycles;
		}

		window.setTimeout(mainLoop, CYCLE_TICKS - (ticks % CYCLE_TICKS));
	};

	let init = function(){
		appstart = (new Date()).getTime();

		canvas = document.createElement("canvas");
		canvas.id = "LD46-canvas";
		canvas.width = canvas.height = resolution;

		ctx = canvas.getContext("2d", { "alpha": true });
		ctx.save();
		fillRect(0, 0, null, null, "white");

		outline = document.createElement("img");
		outline.id = "LD46-outline";
		outline.src = "border-3600.png";

		zing = document.createElement("img");
		zing.src = "character-550.png";

		zzing = document.createElement("img");
		zzing.src = "terrain-550.png";

		document.body.appendChild(canvas);
		document.body.appendChild(outline);
		document.body.appendChild(zing);

		window.addEventListener('resize', resize);
		resize();

		mainLoopTicks = getTicks();
		mainLoop();
	};

	let errorHandler = function(message, source, lineno, colno, error) {
		alert("JavaScript error! " + message.message);
	};

	window.addEventListener('load', init);
	window.addEventListener('error', errorHandler);
})();
