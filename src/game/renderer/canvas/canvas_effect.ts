import { FRAGMENT_SIZE, GAME_BOARD_CELL_SIZE } from "@/game/config";
import { CellOriginValue } from "@/game/types";
import type { Block } from "@/game/blocks/block";
import { drawBlock } from "@/game/renderer/canvas/canvas_utils";

enum AnimationState {
	glow,
	fade
}

export class Fragment {
	private x: number;
	private y: number;
	private readonly color: string;
	private readonly velocity_x: number;
	private velocity_y: number;
	private readonly gravity: number;
	private alpha: number;

	constructor(x: number, y: number, color: string) {
		this.x = x;
		this.y = y;
		this.color = color;
		this.velocity_x = (Math.random() - 0.5) * 5;
		this.velocity_y = Math.random() * -5 - 2;
		this.gravity = 0.2;
		this.alpha = 1;
	}

	update() {
		this.x += this.velocity_x;
		this.y += this.velocity_y;
		this.velocity_y += this.gravity;
		this.alpha -= 0.02;
	}

	draw(ctx: CanvasRenderingContext2D) {
		ctx.fillStyle = this.color;
		ctx.globalAlpha = this.alpha;
		ctx.fillRect(this.x, this.y, FRAGMENT_SIZE, FRAGMENT_SIZE);
		ctx.globalAlpha = 1;
	}

	get show() {
		return this.alpha > 0;
	}
}


export class GlowBlocks {
	private readonly ctx: CanvasRenderingContext2D;
	public glow_alpha: number;
	private glow_speed: number = 0.01;
	private intensity: number = 0;
	private color: string = "#fff";
	private readonly blocks: Set<Block>;

	constructor(ctx: CanvasRenderingContext2D, blocks: Set<Block>) {
		this.ctx = ctx;
		this.glow_alpha = 0;
		this.blocks = blocks;
	}

	update() {
		this.glow_alpha += this.glow_speed;
	}

	draw() {
		this.blocks.forEach(block => {
			this.ctx.save();
			this.ctx.shadowColor = this.color;
			this.ctx.shadowBlur = 20 * this.intensity;
			this.ctx.globalAlpha = this.glow_alpha;
			drawBlock(this.ctx, block);
			this.ctx.restore();
		});
		// const { size, bottom_right: [bottom, right] } = this.square;
		// const x = (right - size + 1) * GAME_BOARD_CELL_SIZE;
		// const y = (bottom - size + 1) * GAME_BOARD_CELL_SIZE;
		// const width = size * GAME_BOARD_CELL_SIZE;
		// const height = size * GAME_BOARD_CELL_SIZE;

		// this.ctx.save();
		// this.ctx.shadowColor = this.color;
		// this.ctx.shadowBlur = 20 * this.intensity;
		// this.ctx.fillStyle = this.color;
		// this.ctx.globalAlpha = this.glow_alpha;
		// this.ctx.fillRect(x, y, width, height);
		// this.ctx.restore();
	}
}

// 可复用的破碎效果函数
function createFragments(blocks: Set<Block>) {
	// const { size, bottom_right: [bottom, right] } = square;
	const fragments: Fragment[] = [];
	blocks.forEach(block => {
		const [x, y] = block.getPosition();
		const shape = block.getShape();

		shape.forEach((row, row_index) => {
			row.forEach((cell, col_index) => {
				if (cell.origin === CellOriginValue.Empty) return;
				const cell_x = (x + col_index) * GAME_BOARD_CELL_SIZE;
				const cell_y = (y + row_index) * GAME_BOARD_CELL_SIZE;
				const color = block.getColor();
				const count = Math.ceil(GAME_BOARD_CELL_SIZE / FRAGMENT_SIZE);

				for (let i = 0; i < count; i++) {
					fragments.push(new Fragment(cell_x + i, cell_y, color));
				}
			});
		});
	});
	// const x = (right - size + 1) * GAME_BOARD_CELL_SIZE;
	// const y = (bottom - size + 1) * GAME_BOARD_CELL_SIZE;
	// const width = size * GAME_BOARD_CELL_SIZE;
	// const height = size * GAME_BOARD_CELL_SIZE;
	//
	// for (let i = x; i < width + x; i += FRAGMENT_SIZE) {
	// 	const col = Math.floor((i) / GAME_BOARD_CELL_SIZE);
	// 	for (let j = y; j < height + y; j += FRAGMENT_SIZE) {
	// 		const row = Math.floor((j) / GAME_BOARD_CELL_SIZE);
	// 		const cell = board[row][col];
	//
	// 		if (cell.length === 0) continue;
	// 		if (cell.length === 1) {
	// 			fragments.push(new Fragment(i, j, cell[0].block.getColor()));
	// 		} else {
	// 			if (j % 2) {
	// 				fragments.push(new Fragment(i, j, cell[0].block.getColor()));
	// 			} else {
	// 				fragments.push(new Fragment(i, j, cell[1].block.getColor()));
	// 			}
	// 		}
	// 	}
	// }
	return fragments;
}

// 动画控制器
export class AnimationController {
	private readonly ctx: CanvasRenderingContext2D;
	private fragments: Fragment[];
	private glow_square: GlowBlocks;
	private state: AnimationState = AnimationState.glow;

	constructor(ctx: CanvasRenderingContext2D, blocks: Set<Block>) {
		this.ctx = ctx;
		this.fragments = createFragments(blocks);
		this.glow_square = new GlowBlocks(ctx, blocks);
	}

	update() {
		if (this.state === AnimationState.glow) {
			this.glow_square.update();
			if (this.glow_square.glow_alpha > 1) {
				this.state = AnimationState.fade;
			}
		} else {
			this.fragments = this.fragments.filter(fragment => fragment.show);
			this.fragments.forEach(fragment => fragment.update());
		}
	}

	draw() {
		if (this.state === AnimationState.glow) {
			this.glow_square.draw();
		} else {
			this.fragments.forEach(fragment => fragment.draw(this.ctx));
		}
	}

	isAnimationComplete() {
		return this.fragments.length === 0;
	}
}



