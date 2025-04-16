import { Renderer, type RendererOptions } from "@/game/renderer/renderer";
import { type BevelledSquare, type Board, type NormalSquare, SquareType } from "@/game/types";
import type { Block } from "@/game/blocks/block";
import { SPREAD_LIGHT_STEP } from "@/game/config";
import { BlockEraseAnimation, SpreadLightAnimation } from "@/game/renderer/canvas/effect";
import { createBackground, drawBevelledSquare, drawBlock, drawBoard, drawSquare, drawSquareBorder, drawBevelledSquareBorder } from "@/game/renderer/canvas/utils";
import { getBevelledSquareMaxSquare } from "@/utils/utils";

export class CanvasRenderer extends Renderer {
	private readonly game_ctx: CanvasRenderingContext2D;
	private readonly background: HTMLCanvasElement;

	constructor(game_dom: HTMLElement, options: RendererOptions) {
		super(game_dom, options);
		const game_canvas = document.createElement("canvas");

		this.game_ctx = game_canvas.getContext("2d") as CanvasRenderingContext2D;

		game_canvas.width = options.board_cell_size * options.columns;
		game_canvas.height = options.board_cell_size * (options.rows + this.active_board_rows);
		console.log(game_canvas.height);

		this.game_container.appendChild(game_canvas);

		const background_height = game_canvas.height - options.board_cell_size * this.active_board_rows;
		this.background = createBackground(game_canvas.width, background_height, this.board_cell_size);
	}

	render(board: Board, active_block: Block | null) {
		this.clear();
		this.drawBackground(this.game_ctx);
		drawBoard(this.game_ctx, board, this.board_cell_size);
		drawBlock(this.game_ctx, active_block, this.board_cell_size);
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

	private drawBackground(ctx: CanvasRenderingContext2D) {
		const active_board_height = this.board_cell_size * this.active_board_rows;
		ctx.drawImage(this.background, 0, active_board_height);
	}
}
