import { FRAGMENT_SIZE } from "@/game/config";
import { CellValue, type Rectangle, type NormalSquare } from "@/game/types";
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
		this.alpha -= 0.01;
		this.alpha = Math.max(0, this.alpha);
	}

	draw(ctx: CanvasRenderingContext2D) {
		if (!this.show) return;
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
	private board_cell_size: number;

	constructor(ctx: CanvasRenderingContext2D, blocks: Set<Block>, board_cell_size: number) {
		this.ctx = ctx;
		this.glow_alpha = 0;
		this.blocks = blocks;
		this.board_cell_size = board_cell_size;
	}

	update() {
		this.glow_alpha += this.glow_speed;
	}

	draw() {
		this.blocks.forEach((block) => {
			this.ctx.save();
			this.ctx.shadowColor = this.color;
			this.ctx.shadowBlur = 20 * this.intensity;
			this.ctx.globalAlpha = this.glow_alpha;
			drawBlock(this.ctx, block, this.board_cell_size);
			this.ctx.restore();
		});
	}
}

// 可复用的破碎效果函数
function createFragments(blocks: Set<Block>, board_cell_size: number) {
	const fragments: Fragment[] = [];
	blocks.forEach((block) => {
		const [x, y] = block.getPosition();
		const shape = block.getShape();

		shape.forEach((row, row_index) => {
			row.forEach((cell, col_index) => {
				if (cell === CellValue.Empty) return;
				const cell_x = (x + col_index) * board_cell_size;
				const cell_y = (y + row_index) * board_cell_size;
				const color = block.getColor();
				const count = Math.ceil(board_cell_size / FRAGMENT_SIZE);

				for (let i = 0; i < count; i++) {
					fragments.push(new Fragment(cell_x + i, cell_y, color));
				}
			});
		});
	});
	return fragments;
}

// 板块动画控制器
export class BlockEraseAnimation {
	private readonly ctx: CanvasRenderingContext2D;
	private fragments: Fragment[];
	private glow_square: GlowBlocks;
	private state: AnimationState = AnimationState.glow;

	constructor(ctx: CanvasRenderingContext2D, blocks: Set<Block>, board_cell_size: number) {
		this.ctx = ctx;
		this.fragments = createFragments(blocks, board_cell_size);
		this.glow_square = new GlowBlocks(ctx, blocks, board_cell_size);
	}

	update() {
		if (this.state === AnimationState.glow) {
			this.glow_square.update();
			if (this.glow_square.glow_alpha > 1) {
				this.state = AnimationState.fade;
			}
		} else {
			this.fragments = this.fragments.filter((fragment) => fragment.show);
			this.fragments.forEach((fragment) => fragment.update());
		}
	}

	draw() {
		if (this.state === AnimationState.glow) {
			this.glow_square.draw();
		} else {
			this.fragments.forEach((fragment) => fragment.draw(this.ctx));
		}
	}

	get isAnimationComplete() {
		return this.fragments.length === 0;
	}

	get isGlowComplete() {
		return this.state === AnimationState.fade;
	}
}

// 光线扩散动画
export class SpreadLightAnimation {
	private readonly ctx: CanvasRenderingContext2D;
	private readonly step: number;
	private up_light_rectangle: Rectangle;
	private left_light_rectangle: Rectangle;
	private right_light_rectangle: Rectangle;
	private down_light_rectangle: Rectangle;

	constructor(ctx: CanvasRenderingContext2D, square: NormalSquare, step: number, board_cell_size: number) {
		this.ctx = ctx;
		this.step = step;

		const {
			size,
			bottom_right: [bottom_board, right_board]
		} = square;

		const left = (right_board - size + 1) * board_cell_size;
		const top = (bottom_board - size + 1) * board_cell_size;
		const right = (right_board + 1) * board_cell_size;
		const bottom = (bottom_board + 1) * board_cell_size;
		const width = size * board_cell_size;
		const height = size * board_cell_size;

		this.up_light_rectangle = [left, top - 1, width, 1];
		this.left_light_rectangle = [left - 1, top, 1, height];
		this.right_light_rectangle = [right, top, 1, height];
		this.down_light_rectangle = [left, bottom, width, 1];
	}

	update() {
		this.up_light_rectangle[1] -= this.step;
		this.up_light_rectangle[3] += this.step;
		this.left_light_rectangle[0] -= this.step;
		this.left_light_rectangle[2] += this.step;
		this.right_light_rectangle[2] += this.step;
		this.down_light_rectangle[3] += this.step;
	}

	draw() {
		this.ctx.fillStyle = "rgba(255, 255, 255, 0.8)";

		this.ctx.fillRect(...this.up_light_rectangle);
		this.ctx.fillRect(...this.left_light_rectangle);
		this.ctx.fillRect(...this.right_light_rectangle);
		this.ctx.fillRect(...this.down_light_rectangle);
	}

	get isAnimationComplete() {
		return this.up_light_rectangle[1] <= 0 && this.left_light_rectangle[0] <= 0 && this.right_light_rectangle[0] + this.right_light_rectangle[2] >= this.ctx.canvas.width && this.down_light_rectangle[3] + this.down_light_rectangle[1] >= this.ctx.canvas.height;
	}
}
