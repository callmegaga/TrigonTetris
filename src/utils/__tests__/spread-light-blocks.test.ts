import { describe, expect, it } from "vitest";
import { type Board, CellValue, SquareType } from "@/game/types";
import { findBlocksInSpreadLight } from "@/utils/utils";
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

describe("findBlocksInSpreadLight", () => {
	it("collects only blocks in the horizontal band for a normal square", () => {
		const board = createBoard(6, 6);
		const horizontal_block = createTestBlock("#111");
		const vertical_block = createTestBlock("#222");
		const outside_block = createTestBlock("#333");

		addFullCell(board, 2, 0, horizontal_block);
		addFullCell(board, 0, 2, vertical_block);
		addFullCell(board, 5, 5, outside_block);

		const blocks = findBlocksInSpreadLight(board, {
			type: SquareType.normal,
			size: 2,
			bottom_right: [3, 3]
		});

		expect(blocks.has(horizontal_block)).toBe(true);
		expect(blocks.has(vertical_block)).toBe(false);
		expect(blocks.has(outside_block)).toBe(false);
	});

	it("uses the bevelled square bounding square as the horizontal band", () => {
		const board = createBoard(8, 7);
		const horizontal_block = createTestBlock("#111");
		const vertical_block = createTestBlock("#222");
		const outside_block = createTestBlock("#333");

		addFullCell(board, 3, 0, horizontal_block);
		addFullCell(board, 0, 3, vertical_block);
		addFullCell(board, 7, 6, outside_block);

		const blocks = findBlocksInSpreadLight(board, {
			type: SquareType.bevelled,
			size: 2,
			top_left: [2, 3]
		});

		expect(blocks.has(horizontal_block)).toBe(true);
		expect(blocks.has(vertical_block)).toBe(false);
		expect(blocks.has(outside_block)).toBe(false);
	});
});
