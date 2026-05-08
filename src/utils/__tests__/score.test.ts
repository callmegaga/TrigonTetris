import { describe, expect, it } from "vitest";
import { type Board, type BoardCellValue, CellValue, SquareType } from "@/game/types";
import { calculateSquareScore } from "@/utils/utils";
import type { Block } from "@/game/blocks/block";

function createTestBlock(color: string): Block {
	return {
		getColor: () => color
	} as Block;
}

function createBoard(rows: number, columns: number): Board {
	return Array.from({ length: rows }, () => Array.from({ length: columns }, () => []));
}

function addFullCell(board: Board, y: number, x: number, block: Block) {
	board[y][x].push({
		value: CellValue.Full,
		block
	});
}

function addTriangleCell(board: Board, y: number, x: number, value: BoardCellValue, block: Block) {
	board[y][x].push({
		value,
		block
	});
}

describe("calculateSquareScore", () => {
	it("uses area, block count, and color multiplier for perfect normal squares", () => {
		const board = createBoard(3, 3);
		const red_block = createTestBlock("#f00");
		const blue_block = createTestBlock("#00f");
		const green_block = createTestBlock("#0f0");
		const yellow_block = createTestBlock("#ff0");

		addFullCell(board, 0, 0, red_block);
		addFullCell(board, 0, 1, blue_block);
		addFullCell(board, 0, 2, green_block);
		addFullCell(board, 1, 0, yellow_block);
		addFullCell(board, 1, 1, red_block);
		addFullCell(board, 1, 2, blue_block);
		addFullCell(board, 2, 0, green_block);
		addFullCell(board, 2, 1, yellow_block);
		addFullCell(board, 2, 2, red_block);

		expect(
			calculateSquareScore(
				board,
				{
					type: SquareType.normal,
					size: 3,
					bottom_right: [2, 2]
				},
				true
			)
		).toBe(3600);
	});

	it("uses bounding square area for perfect bevelled squares", () => {
		const board = createBoard(4, 4);
		const red_block = createTestBlock("#f00");
		const blue_block = createTestBlock("#00f");
		const green_block = createTestBlock("#0f0");
		const yellow_block = createTestBlock("#ff0");
		const purple_block = createTestBlock("#a0f");

		addTriangleCell(board, 0, 1, CellValue.TriangleRightBottom, red_block);
		addTriangleCell(board, 0, 2, CellValue.TriangleLeftBottom, blue_block);
		addTriangleCell(board, 1, 0, CellValue.TriangleRightBottom, green_block);
		addTriangleCell(board, 1, 3, CellValue.TriangleLeftBottom, yellow_block);
		addFullCell(board, 1, 1, purple_block);
		addFullCell(board, 1, 2, red_block);
		addFullCell(board, 2, 1, blue_block);
		addFullCell(board, 2, 2, green_block);
		addTriangleCell(board, 2, 0, CellValue.TriangleRightTop, yellow_block);
		addTriangleCell(board, 2, 3, CellValue.TriangleLeftTop, purple_block);
		addTriangleCell(board, 3, 1, CellValue.TriangleRightTop, red_block);
		addTriangleCell(board, 3, 2, CellValue.TriangleLeftTop, blue_block);

		expect(
			calculateSquareScore(
				board,
				{
					type: SquareType.bevelled,
					size: 2,
					top_left: [0, 1]
				},
				true
			)
		).toBe(80000);
	});

	it("does not score cover squares", () => {
		const board = createBoard(1, 1);
		addFullCell(board, 0, 0, createTestBlock("#f00"));

		expect(
			calculateSquareScore(
				board,
				{
					type: SquareType.normal,
					size: 1,
					bottom_right: [0, 0]
				},
				false
			)
		).toBe(0);
	});
});
