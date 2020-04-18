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
const FACING_LEFT = 1;
const FACING_RIGHT = 0;

const ANIM_IDLE = 0;
const ANIM_WALK = 1;
const ANIM_JUMP = 2;
const ANIM_FLYI = 3;
const ANIM_FALL = 4;
const ANIM_LAND = 5;

function __player() {
	let self = this;

	this.position = {"x": 0, "y": 0};
	this.velocity = {"x": 0, "y": 0};
	this.facing = FACING_RIGHT;

	this.animation = ANIM_IDLE;
	this.animationCycles = 0;

	this.speed = 0.5;
	this.jumpSpeed = 1.65;
	this.jumpPower = 3.0;


	this.changeAnimation = function(newAnim) {
		if(self.animation === newAnim) return;

		self.animation = newAnim;
		self.animationCycles = 0;
	}

	this.processInput = function(input) {
		if(self.animation > ANIM_WALK) {
			return;
		}

		if(input.keyState[ARROW_UP]) {
			self.velocity = {"x": 0, "y": 0};
			self.changeAnimation(ANIM_JUMP);
			return;
		}

		let direction = 0;
		if(input.keyState[ARROW_LEFT]) direction -= 1;
		if(input.keyState[ARROW_RIGHT]) direction += 1;

		if(direction != 0) {
			self.velocity.x = direction * self.speed;
			self.facing = (direction > 0) ? FACING_RIGHT : FACING_LEFT;
			self.changeAnimation(ANIM_WALK);
		} else {
			self.velocity.x = 0;
			self.changeAnimation(ANIM_IDLE);
		}
	};
}
