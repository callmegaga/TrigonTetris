import { type Board, type Position, CellValue } from "@/game/types";
import type { Block } from "@/game/blocks/block";
import { GAME_BOARD_CELL_SIZE } from "@/game/config";

export function drawBoard(ctx: CanvasRenderingContext2D, board: Board) {
	board.forEach((row, y) => {
		row.forEach((cell, x) => {
			cell.forEach((block) => {
				drawCell(ctx, [x, y], block.value, block.block.getColor(), GAME_BOARD_CELL_SIZE);
			});
		});
	});
}

export function drawBlock(ctx: CanvasRenderingContext2D, block: Block | null) {
	if (!block) return;

	const shape = block.getShape();
	const color = block.getColor();
	const block_position = block.getPosition();

	shape.forEach((row, y) => {
		row.forEach((cell, x) => {
			drawCell(ctx, [x + block_position[0], y + block_position[1]], cell, color, GAME_BOARD_CELL_SIZE);
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
