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

	const ANIMATION_CYCLES = Math.floor(CYCLES_PER_SECOND / 4);
	const GRAVITY = 7.0;

	const resolution = 1600;

	var Assets, Input, Player;

	var appstart;
	var canvas, ctx;
	var mainLoopTicks;
	var outline;

	var img_chara = [];
	var img_terrain;

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

	let colourGrey = function(value) {
		return colourRGB(value, value, value);
	};

	let colourGreyAlpha = function(value, alpha) {
		return colourRGBA(value, value, value, alpha);
	};

	let colourRGB = function(r, g, b) {
		return "rgb(" + Math.floor(r) + "," + Math.floor(g) + "," + Math.floor(b) + ")";
	};

	let colourRGBA = function(r, g, b, a) {
		return "rgba(" + Math.floor(r) + "," + Math.floor(g) + "," + Math.floor(b) + "," + (a / 255) + ")";
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
			ctx.drawImage(img_terrain, (t % 2) * 550, Math.floor(t / 2) * 550, 550, 550, 400 * (i - Player.position.x), (resolution - 400) / 2, 400, 400);
		}

		let frame = Math.floor(Player.animationCycles / ANIMATION_CYCLES);
		ctx.drawImage(
			img_chara[Player.animation],
			Player.facing * 550, frame * 550, 550, 550,
			(resolution - 400) / 2, (resolution - 400) / 2 + (Player.position.y * 400), 400, 400
		);
	};

	let gameLogic = function() {
		Player.processInput(Input);

		Player.animationCycles += 1;

		let frame;
		if(Player.animationCycles % ANIMATION_CYCLES == 0) {
			frame = Math.floor(Player.animationCycles / ANIMATION_CYCLES);
		} else {
			frame = null;
		}

		if(Player.animation === ANIM_JUMP) {
			if(frame === 3) {
				Player.velocity.x = ((Player.facing === FACING_RIGHT) ? +1 : -1) * Player.jumpSpeed;
				Player.velocity.y -= Player.jumpPower;
				Player.changeAnimation(ANIM_FLYI);
			}
		} else if(Player.animation === ANIM_LAND) {
			if(frame === 3) {
				Player.changeAnimation(ANIM_IDLE);
			}
		} else {
			if(frame === 4) Player.animationCycles = 0;
		}

		Player.position.x += CYCLE_SECONDS * Player.velocity.x;

		if(Player.velocity.y != 0) {
			Player.velocity.y += CYCLE_SECONDS * GRAVITY;
			if(Player.velocity.y > 0) Player.changeAnimation(ANIM_FALL);

			Player.position.y += CYCLE_SECONDS * Player.velocity.y;

			if(Player.position.y >= 0) {
				Player.position.y = 0;

				Player.velocity.x = 0;
				Player.velocity.y = 0;

				Player.changeAnimation(ANIM_LAND);
			}
		}
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

		let fontSize = 48;
		ctx.font = fontSize + "px monospace";
		ctx.textAlign = 'start';
		ctx.textBaseline = 'top';

		let list = Assets.getList();
		for(let i = 0; i < list.length; ++i) {
			let y = 8 + (i * fontSize);

			switch(list[i].ready) {
				case ASSET_LOADING:
					ctx.fillStyle = "black";
					ctx.fillText("[WAIT]", 8, y);
				break;
				case ASSET_READY:
					ctx.fillStyle = "green";
					ctx.fillText("[ OK ]", 8, y);
				break;
				case ASSET_ERROR:
					ctx.fillStyle = "red";
					ctx.fillText("[FAIL]", 8, y);
				break;
			}

			ctx.fillStyle = "black";
			ctx.fillText(list[i].path.toString(), 8 + (4 * fontSize), y);
		}

		let eight = Math.floor(getTicks() / 100) % 8;
		for(let i = 1; i <= 3; ++i) {
			let p = (eight + i) % 8;

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
				colourGreyAlpha(0, 255 - (i * 64))
			);
		}

		window.setTimeout(loadingLoop, CYCLE_TICKS);
	};

	let init = function(){
		appstart = (new Date()).getTime();

		Assets = new __assets();
		Input = new __input();
		Player = new __player();

		canvas = document.createElement("canvas");
		canvas.id = "LD46-canvas";
		canvas.width = canvas.height = resolution;
		document.body.appendChild(canvas);

		ctx = canvas.getContext("2d", { "alpha": true });
		ctx.save();

		outline = Assets.addGfx("border-3600.png");
		img_terrain = Assets.addGfx("terrain-550.png");

		img_chara[ANIM_IDLE] = Assets.addGfx("character-idle-550.png");
		img_chara[ANIM_WALK] = Assets.addGfx("character-walk-550.png");
		img_chara[ANIM_JUMP] = Assets.addGfx("character-jump-550.png");
		img_chara[ANIM_FLYI] = Assets.addGfx("character-flyi-550.png");
		img_chara[ANIM_FALL] = Assets.addGfx("character-fall-550.png");
		img_chara[ANIM_LAND] = Assets.addGfx("character-land-550.png");

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
