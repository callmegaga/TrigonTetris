import { describe, expect, it } from "vitest";
import { type Board, CellValue } from "@/game/types";
import type { Block } from "@/game/blocks/block";
import { getSampleBlocks } from "@/utils/sample";
import { calculateSquareScore, findMaxValidBevelledSquare, findMaxValidSquare } from "@/utils/utils";

function buildBoardFromBlocks(blocks: Block[]): Board {
	const rows = Math.max(...blocks.flatMap((block) => block.getShape().map((row, y) => block.getPosition()[1] + y + 1)));
	const columns = Math.max(...blocks.flatMap((block) => block.getShape()[0].map((_, x) => block.getPosition()[0] + x + 1)));
	const board: Board = Array.from({ length: rows }, () => Array.from({ length: columns }, () => []));

	blocks.forEach((block) => {
		const [position_x, position_y] = block.getPosition();
		block.getShape().forEach((row, y) => {
			row.forEach((cell, x) => {
				if (cell === CellValue.Empty) return;
				board[position_y + y][position_x + x].push({
					value: cell,
					block
				});
			});
		});
	});

	return board;
}

function calculateSampleScore(blocks: Block[]) {
	const board = buildBoardFromBlocks(blocks);
	const square = findMaxValidBevelledSquare(board, true) ?? findMaxValidSquare(board, true);
	return square ? calculateSquareScore(board, square, true) : 0;
}

describe("sample scores", () => {
	it("uses the screenshot sample score list", () => {
		expect(getSampleBlocks().map((sample) => sample.score)).toEqual([640, 64, 800, 48, 480, 200000, 2000000, 2160, 3600]);
	});

	it("matches the current perfect score formula", () => {
		const mismatches = getSampleBlocks()
			.map((sample, index) => ({
				index,
				actual: sample.score,
				expected: calculateSampleScore(sample.blocks)
			}))
			.filter((sample) => sample.actual !== sample.expected);

		expect(mismatches).toEqual([]);
	});
});
