import { Renderer } from "@/game/renderer/renderer";
import { type Board, type BoardCellValue, CellOriginValue, type Position, type Square } from "@/game/types";
import type { Block } from "@/game/blocks/block";
import { MAX_SHAPE_SIZE, STAND_BY_COUNT } from "@/game/config";
import { AnimationController } from "@/game/effect/canvas_effect";

const next_size = [MAX_SHAPE_SIZE[0] * STAND_BY_COUNT + 3, MAX_SHAPE_SIZE[1] + 2];

const next_board: Board = Array(next_size[1])
	.fill(0)
	.map(() => new Array(next_size[0]).fill(0).map(() => []));

export class CanvasRenderer extends Renderer {
	private readonly game_ctx: CanvasRenderingContext2D;
	private readonly next_ctx: CanvasRenderingContext2D;
	private readonly background: HTMLCanvasElement;
	private readonly board_cell_size: number;

	constructor(game_dom: HTMLElement, next_dom: HTMLElement, options: { board_cell_size: number; columns: number; rows: number }) {
		super(game_dom, next_dom, options);
		const game_canvas = document.createElement("canvas");

		this.game_ctx = game_canvas.getContext("2d") as CanvasRenderingContext2D;
		this.board_cell_size = options.board_cell_size;

		game_canvas.width = options.board_cell_size * options.columns;
		game_canvas.height = options.board_cell_size * options.rows;

		this.game_container.appendChild(game_canvas);

		const next_canvas = document.createElement("canvas");
		this.next_ctx = next_canvas.getContext("2d") as CanvasRenderingContext2D;
		next_canvas.width = next_size[0] * options.board_cell_size;
		next_canvas.height = next_size[1] * options.board_cell_size;

		this.next_container.appendChild(next_canvas);

		this.background = this.createBackground(game_canvas.width, game_canvas.height);
	}

	render(board: Board, active_block: Block | null) {
		this.game_ctx.clearRect(0, 0, this.game_ctx.canvas.width, this.game_ctx.canvas.height);
		this.drawBackground(this.game_ctx);
		this.drawGrid(this.game_ctx, board);
		this.drawBoard(this.game_ctx, board);
		this.drawBlock(this.game_ctx, active_block);
	}

	renderNextBlock(blocks: Block[]) {
		this.next_ctx.clearRect(0, 0, this.next_ctx.canvas.width, this.next_ctx.canvas.height);
		this.drawGrid(this.next_ctx, next_board);
		blocks.forEach((block, index) => {
			block.setPosition([1 + (1 + MAX_SHAPE_SIZE[0]) * index, 1]);
			this.drawBlock(this.next_ctx, block);
			block.setPosition([0, 0]);
		});
	}

	renderSquareEffect(blocks: Set<Block>, boards: Board) {
		const animationController = new AnimationController(this.game_ctx, square, boards);
		const that = this;
		return new Promise<void>((resolve) => {
			function animate() {
				that.render(boards, null);

				animationController.update();
				animationController.draw();

				if (animationController.isAnimationComplete()) {
					resolve();
				}else {
					requestAnimationFrame(animate);
				}
			}

			animate();
		})
	}

	private createBackground(width: number, height: number) {
		const bgCanvas = document.createElement("canvas");
		const bgCtx = bgCanvas.getContext("2d") as CanvasRenderingContext2D;
		bgCanvas.width = width;
		bgCanvas.height = height;

		const gradient = bgCtx.createLinearGradient(0, 0, 0, bgCanvas.height);
		gradient.addColorStop(0, "#000033");
		gradient.addColorStop(1, "#000066");

		bgCtx.fillStyle = gradient;
		bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);

		return bgCanvas;
	}

	private drawBackground(ctx: CanvasRenderingContext2D) {
		ctx.drawImage(this.background, 0, 0);
	}

	private drawGrid(ctx: CanvasRenderingContext2D, board: Board) {
		const rows = board.length;
		const columns = board[0].length;

		ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
		for (let x = 0; x <= columns; x++) {
			ctx.beginPath();
			ctx.moveTo(x * this.board_cell_size, 0);
			ctx.lineTo(x * this.board_cell_size, rows * this.board_cell_size);
			ctx.stroke();
		}
		for (let y = 0; y <= rows; y++) {
			ctx.beginPath();
			ctx.moveTo(0, y * this.board_cell_size);
			ctx.lineTo(columns * this.board_cell_size, y * this.board_cell_size);
			ctx.stroke();
		}
	}

	private drawBoard(ctx: CanvasRenderingContext2D, board: Board) {
		board.forEach((row, y) => {
			row.forEach((cell, x) => {
				cell.forEach((block) => {
					this.drawCell(ctx, [x, y], block.value, block.block.getColor());
				});
			});
		});
	}

	private drawBlock(ctx: CanvasRenderingContext2D, block: Block | null) {
		if (!block) return;

		const shape = block.getShape();
		const color = block.getColor();
		const block_position = block.getPosition();

		shape.forEach((row, y) => {
			row.forEach((cell, x) => {
				this.drawCell(ctx, [x + block_position[0], y + block_position[1]], cell, color);
			});
		});
	}

	private drawCell(ctx: CanvasRenderingContext2D, position: Position, cell: BoardCellValue, color: string) {
		const x = position[0];
		const y = position[1];

		ctx.fillStyle = color;
		ctx.beginPath();
		switch (cell.origin) {
		case CellOriginValue.Empty:
			return;
		case CellOriginValue.TriangleLeftTop:
			ctx.moveTo(x * this.board_cell_size, y * this.board_cell_size);
			ctx.lineTo((x + 1) * this.board_cell_size, y * this.board_cell_size);
			ctx.lineTo(x * this.board_cell_size, (y + 1) * this.board_cell_size);
			break;
		case CellOriginValue.TriangleLeftBottom:
			ctx.moveTo(x * this.board_cell_size, y * this.board_cell_size);
			ctx.lineTo((x + 1) * this.board_cell_size, (y + 1) * this.board_cell_size);
			ctx.lineTo(x * this.board_cell_size, (y + 1) * this.board_cell_size);
			break;
		case CellOriginValue.TriangleRightTop:
			ctx.moveTo(x * this.board_cell_size, y * this.board_cell_size);
			ctx.lineTo((x + 1) * this.board_cell_size, y * this.board_cell_size);
			ctx.lineTo((x + 1) * this.board_cell_size, (y + 1) * this.board_cell_size);
			break;
		case CellOriginValue.TriangleRightBottom:
			ctx.moveTo((x + 1) * this.board_cell_size, y * this.board_cell_size);
			ctx.lineTo((x + 1) * this.board_cell_size, (y + 1) * this.board_cell_size);
			ctx.lineTo(x * this.board_cell_size, (y + 1) * this.board_cell_size);
			break;
		case CellOriginValue.Full:
			ctx.moveTo(x * this.board_cell_size, y * this.board_cell_size);
			ctx.lineTo((x + 1) * this.board_cell_size, y * this.board_cell_size);
			ctx.lineTo((x + 1) * this.board_cell_size, (y + 1) * this.board_cell_size);
			ctx.lineTo(x * this.board_cell_size, (y + 1) * this.board_cell_size);
			break;
		}
		ctx.closePath();
		ctx.fill();
	}
}
