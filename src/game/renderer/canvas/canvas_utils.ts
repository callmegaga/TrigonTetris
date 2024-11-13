import { type Board, type Position, CellValue, type NormalSquare, type BevelledSquare } from "@/game/types";
import type { Block } from "@/game/blocks/block";

export function drawBoard(ctx: CanvasRenderingContext2D, board: Board, board_cell_size: number) {
	board.forEach((row, y) => {
		row.forEach((cell, x) => {
			cell.forEach((block) => {
				drawCell(ctx, [x, y], block.value, block.block.getColor(), board_cell_size);
			});
		});
	});
}

export function drawGrid(ctx: CanvasRenderingContext2D, board: Board, board_cell_size: number, skip_row: number) {
	const rows = board.length;
	const columns = board[0].length;

	ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
	for (let x = 0; x <= columns; x++) {
		ctx.beginPath();
		ctx.moveTo(x * board_cell_size, skip_row * board_cell_size);
		ctx.lineTo(x * board_cell_size, rows * board_cell_size);
		ctx.stroke();
	}
	for (let y = 0; y <= rows; y++) {
		if (y < skip_row) continue;
		ctx.beginPath();
		ctx.moveTo(0, y * board_cell_size);
		ctx.lineTo(columns * board_cell_size, y * board_cell_size);
		ctx.stroke();
	}
}

export function drawBlock(ctx: CanvasRenderingContext2D, block: Block | null, board_cell_size: number) {
	if (!block) return;

	const shape = block.getShape();
	const color = block.getColor();
	const block_position = block.getPosition();

	shape.forEach((row, y) => {
		row.forEach((cell, x) => {
			if (y + block_position[1] < 0) return;
			drawCell(ctx, [x + block_position[0], y + block_position[1]], cell, color, board_cell_size);
		});
	});
}

export function drawCell(ctx: CanvasRenderingContext2D, position: Position, cell: CellValue, color: string, board_cell_size: number) {
	const x = position[0];
	const y = position[1];

	ctx.fillStyle = color;
	ctx.beginPath();
	switch (cell) {
		case CellValue.Empty:
			return;
		case CellValue.TriangleLeftTop:
			ctx.moveTo(x * board_cell_size, y * board_cell_size);
			ctx.lineTo((x + 1) * board_cell_size, y * board_cell_size);
			ctx.lineTo(x * board_cell_size, (y + 1) * board_cell_size);
			break;
		case CellValue.TriangleLeftBottom:
			ctx.moveTo(x * board_cell_size, y * board_cell_size);
			ctx.lineTo((x + 1) * board_cell_size, (y + 1) * board_cell_size);
			ctx.lineTo(x * board_cell_size, (y + 1) * board_cell_size);
			break;
		case CellValue.TriangleRightTop:
			ctx.moveTo(x * board_cell_size, y * board_cell_size);
			ctx.lineTo((x + 1) * board_cell_size, y * board_cell_size);
			ctx.lineTo((x + 1) * board_cell_size, (y + 1) * board_cell_size);
			break;
		case CellValue.TriangleRightBottom:
			ctx.moveTo((x + 1) * board_cell_size, y * board_cell_size);
			ctx.lineTo((x + 1) * board_cell_size, (y + 1) * board_cell_size);
			ctx.lineTo(x * board_cell_size, (y + 1) * board_cell_size);
			break;
		case CellValue.Full:
			ctx.moveTo(x * board_cell_size, y * board_cell_size);
			ctx.lineTo((x + 1) * board_cell_size, y * board_cell_size);
			ctx.lineTo((x + 1) * board_cell_size, (y + 1) * board_cell_size);
			ctx.lineTo(x * board_cell_size, (y + 1) * board_cell_size);
			break;
	}
	ctx.closePath();
	ctx.fill();
}

export function drawSquare(ctx: CanvasRenderingContext2D, square: NormalSquare, board_cell_size: number) {
	const {
		size,
		bottom_right: [bottom, right]
	} = square;
	const x = (right - size + 1) * board_cell_size;
	const y = (bottom - size + 1) * board_cell_size;
	const width = size * board_cell_size;
	const height = size * board_cell_size;

	ctx.save();
	ctx.fillStyle = "#f00";
	ctx.fillRect(x, y, width, height);
	ctx.restore();
}

export function drawBevelledSquare(ctx: CanvasRenderingContext2D, square: BevelledSquare, board_cell_size: number) {
	const {
		size,
		top_left: [top, left]
	} = square;

	const start_x = (left + 1) * board_cell_size;
	const start_y = top * board_cell_size;

	const left_x = (left - size + 1) * board_cell_size;
	const left_y = (top + size) * board_cell_size;

	const bottom_x = (left + 1) * board_cell_size;
	const bottom_y = (top + 2 * size) * board_cell_size;

	const right_x = (left + size + 1) * board_cell_size;
	const right_y = (top + size) * board_cell_size;

	ctx.save();
	ctx.beginPath();
	ctx.moveTo(start_x, start_y);
	ctx.lineTo(left_x, left_y);
	ctx.lineTo(bottom_x, bottom_y);
	ctx.lineTo(right_x, right_y);
	ctx.closePath();
	ctx.fillStyle = "#f00";
	ctx.fill();
	ctx.restore();
}

export function createBackground(width: number, height: number) {
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
