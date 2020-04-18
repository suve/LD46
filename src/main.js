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
	const CYCLE_SECONDS = 1 / CYCLES_PER_SECOND;
	const CYCLE_TICKS = Math.floor(1000 / CYCLES_PER_SECOND);

	const resolution = 1600;

	var Assets, Input;

	var appstart;
	var canvas, ctx;
	var mainLoopTicks;
	var outline;

	var img_chara_stand, img_chara_walk;
	var img_terrain;

	var chara_position = 1.5;

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

		let terrain = [0, 1, 0, 3, 2, 5, 2, 1, 0, 3, 0, 1, 0, 3, 2, 5, 2, 1, 0, 3];
		for(let i = 0; i < terrain.length; ++i) {
			let t = terrain[i];
			ctx.drawImage(img_terrain, (t % 2) * 550, Math.floor(t / 2) * 550, 550, 550, 400 * (i - chara_position), (resolution - 400) / 2, 400, 400);
		}

		let chara_img = (Input.keyState[ARROW_LEFT] || Input.keyState[ARROW_RIGHT]) ? img_chara_walk : img_chara_stand;

		let frame = Math.floor(getTicks() / 250) % 4;
		ctx.drawImage(chara_img, 0, frame * 550, 550, 550, (resolution - 400) / 2, (resolution - 400) / 2, 400, 400);
	};

	let gameLogic = function() {
		if(Input.keyState[ARROW_LEFT]) chara_position -= CYCLE_SECONDS * 0.5;
		if(Input.keyState[ARROW_RIGHT]) chara_position += CYCLE_SECONDS * 0.5;
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

	let loadingLoop = function() {
		if(Assets.loadingFinished()) {
			outline.id = "LD46-outline";

			mainLoopTicks = getTicks();
			mainLoop();
			return;
		}

		fillRect(0, 0, null, null, "white");

		let eight = Math.floor(getTicks() / 100) % 8;
		for(let i = 1; i < 3; ++i) {
			let p = (eight + i) % 8;

			let colour = i * 64;
			colour = "rgb(" + colour + "," + colour + "," + colour + ")";

			let x = ((p == 0) || (p == 6) || (p == 7)) ? 0 : ((p == 2) || (p == 3) || (p == 4)) ? 2 : 1;
			let y = ((p == 0) || (p == 1) || (p == 2)) ? 0 : ((p == 4) || (p == 5) || (p == 6)) ? 2 : 1;

			let inner = 80;
			let padding = 10;
			let outer = (inner + 2 * padding);

			let basePos = Math.floor((resolution - 3 * (inner + padding)) / 2);
			fillRect(
				basePos + (x * outer) + padding,
				basePos + (y * outer) + padding,
				inner,
				inner,
				colour
			);
		}

		window.setTimeout(loadingLoop, CYCLE_TICKS);
	};

	let init = function(){
		appstart = (new Date()).getTime();

		Assets = new __assets();
		Input = new __input();

		canvas = document.createElement("canvas");
		canvas.id = "LD46-canvas";
		canvas.width = canvas.height = resolution;
		document.body.appendChild(canvas);

		ctx = canvas.getContext("2d", { "alpha": true });
		ctx.save();

		outline = Assets.addGfx("border-3600.png");
		img_terrain = Assets.addGfx("terrain-550.png");
		img_chara_walk = Assets.addGfx("character0-550.png");
		img_chara_stand = Assets.addGfx("character1-550.png");

		window.addEventListener('resize', resize);
		resize();

		loadingLoop();
	};

	let errorHandler = function(message, source, lineno, colno, error) {
		alert("JavaScript error! " + message.message);
	};

	window.addEventListener('load', init);
	window.addEventListener('error', errorHandler);
})();
