import { describe, expect, it } from "vitest";
import { type Board, CellValue, SquareType } from "@/game/types";
import { checkBevelledSquaresValid, getBevelledSquareColorsAndBlocks } from "@/utils/utils";
import type { Block } from "@/game/blocks/block";

function createTestBlock(color: string): Block {
	return {
		getColor: () => color
	} as Block;
}

function createBoard(rows: number, columns: number): Board {
	return Array.from({ length: rows }, () => Array.from({ length: columns }, () => []));
}

describe("getBevelledSquareColorsAndBlocks", () => {
	it("collects full blocks used as bevelled cover border cells", () => {
		const board = createBoard(2, 2);
		const left_top_block = createTestBlock("#111");
		const right_top_block = createTestBlock("#222");
		const left_bottom_block = createTestBlock("#333");
		const right_bottom_block = createTestBlock("#444");

		board[0][0].push({ value: CellValue.Full, block: left_top_block });
		board[0][1].push({ value: CellValue.TriangleLeftBottom, block: right_top_block });
		board[1][0].push({ value: CellValue.TriangleRightTop, block: left_bottom_block });
		board[1][1].push({ value: CellValue.TriangleLeftTop, block: right_bottom_block });

		expect(checkBevelledSquaresValid(board, 0, 0, 1)).toBe(true);

		const { blocks, colors } = getBevelledSquareColorsAndBlocks(board, {
			type: SquareType.bevelled,
			size: 1,
			top_left: [0, 0]
		});

		expect(blocks).toEqual(new Set([left_top_block, right_top_block, left_bottom_block, right_bottom_block]));
		expect(colors).toEqual(new Set(["#111", "#222", "#333", "#444"]));
	});

	it("does not collect complementary border triangles outside the bevelled cover", () => {
		const board = createBoard(2, 2);
		const border_block = createTestBlock("#111");
		const outside_block = createTestBlock("#999");
		const right_top_block = createTestBlock("#222");
		const left_bottom_block = createTestBlock("#333");
		const right_bottom_block = createTestBlock("#444");

		board[0][0].push({ value: CellValue.TriangleRightBottom, block: border_block });
		board[0][0].push({ value: CellValue.TriangleLeftTop, block: outside_block });
		board[0][1].push({ value: CellValue.TriangleLeftBottom, block: right_top_block });
		board[1][0].push({ value: CellValue.TriangleRightTop, block: left_bottom_block });
		board[1][1].push({ value: CellValue.TriangleLeftTop, block: right_bottom_block });

		expect(checkBevelledSquaresValid(board, 0, 0, 1)).toBe(true);

		const { blocks } = getBevelledSquareColorsAndBlocks(board, {
			type: SquareType.bevelled,
			size: 1,
			top_left: [0, 0]
		});

		expect(blocks.has(border_block)).toBe(true);
		expect(blocks.has(outside_block)).toBe(false);
	});
});
