import { Renderer } from "@/game/renderer/renderer";
import { type Board, type BoardCellValue, CellOriginValue, type Position } from "@/game/types";
import type { Block } from "@/game/blocks/block";

export class CanvasRenderer extends Renderer {
	private ctx: CanvasRenderingContext2D;
	private readonly background: HTMLCanvasElement;
	private readonly block_size: number;

	constructor(dom: HTMLElement, options: { block_size: number; columns: number; rows: number }) {
		super(dom, options);
		const canvas = document.createElement("canvas");
		this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
		this.block_size = options.block_size;

		canvas.width = options.block_size * options.columns;
		canvas.height = options.block_size * options.rows;

		this.container.appendChild(canvas);

		this.background = this.createBackground(canvas.width, canvas.height);
	}

	render(board: Board, active_block: Block | null) {
		this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
		this.drawBackground();
		this.drawGrid(board);
		this.drawBoard(board);
		this.drawActiveBlock(active_block);
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

	private drawBackground() {
		this.ctx.drawImage(this.background, 0, 0);
	}

	private drawGrid(board: Board) {
		const rows = board.length;
		const columns = board[0].length;

		this.ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
		for (let x = 0; x <= columns; x++) {
			this.ctx.beginPath();
			this.ctx.moveTo(x * this.block_size, 0);
			this.ctx.lineTo(x * this.block_size, rows * this.block_size);
			this.ctx.stroke();
		}
		for (let y = 0; y <= rows; y++) {
			this.ctx.beginPath();
			this.ctx.moveTo(0, y * this.block_size);
			this.ctx.lineTo(columns * this.block_size, y * this.block_size);
			this.ctx.stroke();
		}
	}

	private drawBoard(board: Board) {
		board.forEach((row, y) => {
			row.forEach((cell, x) => {
				cell.forEach(block => {
					this.drawCell([x, y], block.value, block.block.getColor());
				})
			});
		});
	}

	private drawActiveBlock(active_block: Block | null) {
		if (!active_block) return;

		const shape = active_block.getShape();
		const color = active_block.getColor();
		const block_position = active_block.getPosition();

		shape.forEach((row, y) => {
			row.forEach((cell, x) => {
				this.drawCell([x + block_position[0], y + block_position[1]], cell, color);
			});
		});
	}

	private drawCell(position: Position, cell: BoardCellValue, color: string) {
		const x = position[0];
		const y = position[1];

		this.ctx.fillStyle = color;
		this.ctx.beginPath();
		switch (cell.origin) {
			case CellOriginValue.Empty:
				return;
			case CellOriginValue.TriangleLeftTop:
				this.ctx.moveTo(x * this.block_size, y * this.block_size);
				this.ctx.lineTo((x + 1) * this.block_size, y * this.block_size);
				this.ctx.lineTo(x * this.block_size, (y + 1) * this.block_size);
				break;
			case CellOriginValue.TriangleLeftBottom:
				this.ctx.moveTo(x * this.block_size, y * this.block_size);
				this.ctx.lineTo((x + 1) * this.block_size, (y + 1) * this.block_size);
				this.ctx.lineTo(x * this.block_size, (y + 1) * this.block_size);
				break;
			case CellOriginValue.TriangleRightTop:
				this.ctx.moveTo(x * this.block_size, y * this.block_size);
				this.ctx.lineTo((x + 1) * this.block_size, y * this.block_size);
				this.ctx.lineTo((x + 1) * this.block_size, (y + 1) * this.block_size);
				break;
			case CellOriginValue.TriangleRightBottom:
				this.ctx.moveTo((x + 1) * this.block_size, y * this.block_size);
				this.ctx.lineTo((x + 1) * this.block_size, (y + 1) * this.block_size);
				this.ctx.lineTo(x * this.block_size, (y + 1) * this.block_size);
				break;
			case CellOriginValue.Full:
				this.ctx.moveTo(x * this.block_size, y * this.block_size);
				this.ctx.lineTo((x + 1) * this.block_size, y * this.block_size);
				this.ctx.lineTo((x + 1) * this.block_size, (y + 1) * this.block_size);
				this.ctx.lineTo(x * this.block_size, (y + 1) * this.block_size);
				break;
		}
		this.ctx.closePath();
		this.ctx.fill();
	}
}
