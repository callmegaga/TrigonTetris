import { Renderer } from "@/game/renderer/renderer";
import { type BevelledSquare, type Board, type NormalSquare, SquareType } from "@/game/types";
import type { Block } from "@/game/blocks/block";
import { MAX_SHAPE_SIZE, SPREAD_LIGHT_STEP, STAND_BY_COUNT } from "@/game/config";
import { BlockEraseAnimation, SpreadLightAnimation } from "@/game/renderer/canvas/effect";
import { createBackground, drawBevelledSquare, drawBlock, drawBoard, drawGrid, drawSquare, drawCell, drawSquareBorder, drawBevelledSquareBorder } from "@/game/renderer/canvas/canvas_utils";
import { getBevelledSquareMaxSquare, getSquareColorsAndBlocks } from "@/utils/utils";

const next_size = [MAX_SHAPE_SIZE[0] * STAND_BY_COUNT + 3, MAX_SHAPE_SIZE[1] + 2];

const next_board: Board = Array(next_size[1])
	.fill(0)
	.map(() => new Array(next_size[0]).fill(0).map(() => []));

export class CanvasRenderer extends Renderer {
	private readonly game_ctx: CanvasRenderingContext2D;
	private readonly next_ctx: CanvasRenderingContext2D;
	private readonly background: HTMLCanvasElement;
	private readonly board_cell_size: number;
	private readonly active_board_rows: number;

	constructor(game_dom: HTMLElement, next_dom: HTMLElement, options: { board_cell_size: number; columns: number; rows: number; active_board_rows: number }) {
		super(game_dom, next_dom, options);
		const game_canvas = document.createElement("canvas");

		this.game_ctx = game_canvas.getContext("2d") as CanvasRenderingContext2D;
		this.board_cell_size = options.board_cell_size;

		this.active_board_rows = options.active_board_rows;

		game_canvas.width = options.board_cell_size * options.columns;
		game_canvas.height = options.board_cell_size * (options.rows + this.active_board_rows);

		this.game_container.appendChild(game_canvas);

		const next_canvas = document.createElement("canvas");
		this.next_ctx = next_canvas.getContext("2d") as CanvasRenderingContext2D;
		next_canvas.width = next_size[0] * options.board_cell_size;
		next_canvas.height = next_size[1] * options.board_cell_size;

		this.next_container.appendChild(next_canvas);

		const background_height = game_canvas.height - options.board_cell_size * this.active_board_rows;
		this.background = createBackground(game_canvas.width, background_height, this.board_cell_size);
	}

	render(board: Board, active_block: Block | null) {
		this.clear();
		this.drawBackground(this.game_ctx);
		drawBoard(this.game_ctx, board, this.board_cell_size);
		drawBlock(this.game_ctx, active_block, this.board_cell_size);
	}

	renderNextBlock(blocks: Block[]) {
		this.clearNext();
		drawGrid(this.next_ctx, next_board, this.board_cell_size, 0);
		blocks.forEach((block, index) => {
			const [x, y] = block.getPosition();
			console.log(x, y);
			block.setPosition([1 + (1 + MAX_SHAPE_SIZE[0]) * index, 1]);
			drawBlock(this.next_ctx, block, this.board_cell_size);
			block.setPosition([x, 0]);
		});
	}

	renderBlocks(blocks: Set<Block>, color?: string): void {
		blocks.forEach((block) => {
			drawBlock(this.game_ctx, block, this.board_cell_size, color);
		});
	}

	renderBlockEffect(boards: Board, blocks: Set<Block>): Promise<void> {
		const animation = new BlockEraseAnimation(this.game_ctx, blocks, this.board_cell_size);
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const that: CanvasRenderer = this;
		return new Promise<void>((resolve) => {
			function animate() {
				that.render(boards, null);

				animation.update();
				animation.draw();

				if (animation.isAnimationComplete) {
					resolve();
				} else {
					requestAnimationFrame(animate);
				}
			}

			animate();
		});
	}

	renderSpreadLight(boards: Board, square: NormalSquare | BevelledSquare): Promise<void> {
		if (square.type === SquareType.bevelled) {
			square = getBevelledSquareMaxSquare(square);
		}
		const animation = new SpreadLightAnimation(this.game_ctx, square, SPREAD_LIGHT_STEP, this.board_cell_size);

		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const that: CanvasRenderer = this;
		return new Promise<void>((resolve) => {
			function animate() {
				that.render(boards, null);

				animation.update();
				animation.draw();

				if (animation.isAnimationComplete) {
					resolve();
				} else {
					requestAnimationFrame(animate);
				}
			}

			animate();
		});
	}

	renderSquare(boards: Board, square: NormalSquare | BevelledSquare, is_perfect: boolean) {
		if (is_perfect) {
			if (square.type === SquareType.bevelled) {
				drawBevelledSquare(this.game_ctx, square, this.board_cell_size);
			}

			if (square.type === SquareType.normal) {
				drawSquare(this.game_ctx, square, this.board_cell_size);
			}
		} else {
			if (square.type === SquareType.bevelled) {
				drawBevelledSquareBorder(this.game_ctx, square, this.board_cell_size);
			}

			if (square.type === SquareType.normal) {
				drawSquareBorder(this.game_ctx, square, this.board_cell_size);
			}
		}

		return new Promise<void>((resolve) => {
			setTimeout(() => {
				this.render(boards, null);
				resolve();
			}, 3000);
		});
	}

	private clear() {
		this.game_ctx.clearRect(0, 0, this.game_ctx.canvas.width, this.game_ctx.canvas.height);
	}

	private clearNext() {
		this.next_ctx.clearRect(0, 0, this.next_ctx.canvas.width, this.next_ctx.canvas.height);
	}

	private drawBackground(ctx: CanvasRenderingContext2D) {
		const active_board_height = this.board_cell_size * this.active_board_rows;
		ctx.drawImage(this.background, 0, active_board_height);
	}
}
