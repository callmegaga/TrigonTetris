import { describe, expect, it } from "vitest";
import { type Board, CellValue, SquareType } from "@/game/types";
import type { Block } from "@/game/blocks/block";
import { getSampleBlocks } from "@/utils/sample";
import { calculateSquareScore, findMaxValidBevelledSquare, findMaxValidSquare, getSquareColorsAndBlocks } from "@/utils/utils";

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

function getSampleAnalysis(score: number) {
	const sample = getSampleBlocks().find((item) => item.score === score);
	expect(sample).toBeDefined();

	const board = buildBoardFromBlocks(sample!.blocks);
	const square = findMaxValidBevelledSquare(board, true) ?? findMaxValidSquare(board, true);
	expect(square).toBeDefined();

	return {
		board,
		square: square!
	};
}

function getBoardColorSignatures(board: Board) {
	return board.map((row) =>
		row.map((cell) => {
			if (cell.length === 0) return ".";
			return [...new Set(cell.map((fragment) => fragment.block.getColor()))].sort().join("");
		})
	);
}

describe("sample scores", () => {
	it("uses the screenshot sample score list", () => {
		expect(getSampleBlocks().map((sample) => sample.score)).toEqual([640, 64, 800, 48, 480, 200000, 2000000, 2160, 3600, 27, 6400000]);
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

	it("builds every sample from a perfect square candidate", () => {
		const samplesWithoutPerfect = getSampleBlocks()
			.map((sample, index) => ({
				index,
				score: sample.score,
				square: findMaxValidBevelledSquare(buildBoardFromBlocks(sample.blocks), true) ?? findMaxValidSquare(buildBoardFromBlocks(sample.blocks), true)
			}))
			.filter((sample) => !sample.square);

		expect(samplesWithoutPerfect).toEqual([]);
	});

	it("builds the 640 score sample with the screenshot layout", () => {
		const { board } = getSampleAnalysis(640);

		expect(getBoardColorSignatures(board)).toEqual([
			["#5d2e8c#f8bf2d", "#5d2e8c", "#5d2e8c", "#5d2e8c"],
			["#f8bf2d", "#5d2e8c#f8bf2d", "#5d2e8c", "#5d2e8c"],
			["#f8bf2d", "#f799fc#f8bf2d", "#5d2e8c#f799fc", "#5d2e8c"],
			["#f799fc", "#f799fc", "#f799fc", "#5d2e8c#f799fc"]
		]);
	});

	it("builds the 64 score sample with the screenshot layout", () => {
		const { board } = getSampleAnalysis(64);

		expect(getBoardColorSignatures(board)).toEqual([
			["#f799fc#f8bf2d", "#f799fc", "#f799fc", "#f799fc"],
			["#f8bf2d", "#f799fc#f8bf2d", "#f799fc#f8bf2d", "#f8bf2d"],
			["#f8bf2d", "#f799fc#f8bf2d", "#f799fc#f8bf2d", "#f8bf2d"],
			["#f799fc", "#f799fc", "#f799fc", "#f799fc#f8bf2d"]
		]);
	});

	it.each([
		[
			800,
			[
				["#5d2e8c#a2d9e9", "#5d2e8c", "#5d2e8c", "#5d2e8c"],
				["#a2d9e9", "#5d2e8c#a2d9e9", "#5d2e8c", "#5d2e8c"],
				["#a6a6a6", "#a6a6a6", "#5d2e8c#a2d9e9", "#5d2e8c"],
				["#a6a6a6", "#a6a6a6", "#a2d9e9", "#5d2e8c#a2d9e9"]
			]
		],
		[
			48,
			[
				[".", "#a2d9e9", "#5d2e8c", "."],
				["#a2d9e9", "#a2d9e9", "#5d2e8c", "#5d2e8c"],
				["#a2d9e9", "#a2d9e9", "#5d2e8c", "#5d2e8c"],
				[".", "#a2d9e9", "#5d2e8c", "."]
			]
		],
		[
			480,
			[
				[".", "#f8bf2d", "#a2d9e9", "."],
				["#f8bf2d", "#f8bf2d", "#a2d9e9", "#a2d9e9"],
				["#f8bf2d", "#f8bf2d", "#3db056", "#3db056"],
				[".", "#3db056", "#3db056", "."]
			]
		],
		[
			200000,
			[
				["#f8bf2d", "#f8bf2d", "#5d2e8c#f8bf2d", "#5d2e8c#a2d9e9", "#a2d9e9"],
				["#5d2e8c#f8bf2d", "#5d2e8c#f8bf2d", "#5d2e8c", "#5d2e8c", "#5d2e8c#a2d9e9"],
				["#5d2e8c", "#5d2e8c", "#5d2e8c", "#5d2e8c", "#3db056#5d2e8c"],
				["#5d2e8c", "#5d2e8c", "#5d2e8c", "#3db056#5d2e8c", "#3db056"],
				["#5d2e8c", "#5d2e8c", "#5d2e8c", "#3db056#5d2e8c", "#a6a6a6"]
			]
		],
		[
			2000000,
			[
				["#f8bf2d", "#f8bf2d", "#5d2e8c#f8bf2d", "#5d2e8c#a2d9e9", "#a2d9e9"],
				["#f8bf2d", "#5d2e8c#f8bf2d", "#5d2e8c", "#5d2e8c", "#5d2e8c#a2d9e9"],
				["#f8bf2d", "#5d2e8c#f8bf2d", "#5d2e8c", "#5d2e8c", "#3db056#5d2e8c"],
				["#f8bf2d", "#f799fc#f8bf2d", "#5d2e8c#f799fc", "#3db056#5d2e8c", "#3db056"],
				["#f799fc", "#f799fc", "#f799fc", "#3db056#f799fc", "#a6a6a6"]
			]
		],
		[
			2160,
			[
				[".", ".", "#f8bf2d", "#f8bf2d", ".", "."],
				[".", "#f8bf2d", "#f8bf2d", "#f8bf2d", "#3db056", "."],
				["#f8bf2d", "#f8bf2d", "#a6a6a6", "#a6a6a6", "#3db056", "#3db056"],
				["#f8bf2d", "#f8bf2d", "#a6a6a6", "#a6a6a6", "#a6a6a6", "#3db056"],
				[".", "#f8bf2d", "#f8bf2d", "#f8bf2d", "#f8bf2d", "."],
				[".", ".", "#f8bf2d", "#f8bf2d", ".", "."]
			]
		],
		[
			3600,
			[
				["#3db056#f8bf2d", "#f8bf2d", "#f8bf2d"],
				["#3db056", "#3db056#f8bf2d", "#a2d9e9#f8bf2d"],
				["#a6a6a6", "#3db056#a2d9e9", "#a2d9e9"]
			]
		]
	])("builds the %i score sample with the screenshot layout", (score, expectedLayout) => {
		const { board } = getSampleAnalysis(score);

		expect(getBoardColorSignatures(board)).toEqual(expectedLayout);
	});

	it("builds the 27 score sample as a three-block normal perfect square", () => {
		const { board, square } = getSampleAnalysis(27);

		expect(square).toEqual({
			type: SquareType.normal,
			size: 3,
			bottom_right: [2, 2]
		});

		const { blocks, colors } = getSquareColorsAndBlocks(board, square);
		expect(blocks.size).toBe(3);
		expect(colors.size).toBe(2);
		expect(calculateSquareScore(board, square, true)).toBe(27);
		expect(getBoardColorSignatures(board)).toEqual([
			["#f8bf2d", "#f8bf2d", "#f8bf2d"],
			["#f8bf2d", "#f8bf2d", "#a2d9e9#f8bf2d"],
			["#f8bf2d", "#a2d9e9#f8bf2d", "#a2d9e9"]
		]);
	});

	it("builds the 6400000 score sample as a ten-block bevelled perfect square", () => {
		const { board, square } = getSampleAnalysis(6400000);

		expect(square).toEqual({
			type: SquareType.bevelled,
			size: 4,
			top_left: [0, 3]
		});

		const { blocks, colors } = getSquareColorsAndBlocks(board, square);
		expect(blocks.size).toBe(10);
		expect(colors.size).toBe(6);
		expect(calculateSquareScore(board, square, true)).toBe(6400000);
		expect(getBoardColorSignatures(board)).toEqual([
			[".", ".", ".", "#f8bf2d", "#3db056", ".", ".", "."],
			[".", ".", "#f8bf2d", "#f8bf2d", "#3db056", "#3db056", ".", "."],
			[".", "#f799fc", "#f799fc#f8bf2d", "#f8bf2d", "#a6a6a6", "#3db056#f799fc", "#f799fc", "."],
			["#f799fc", "#f799fc", "#f799fc", "#f799fc", "#f799fc", "#f799fc", "#f799fc", "#f799fc"],
			["#5d2e8c", "#5d2e8c", "#5d2e8c", "#5d2e8c", "#a6a6a6", "#a6a6a6", "#a2d9e9", "#a2d9e9"],
			[".", "#5d2e8c", "#5d2e8c", "#5d2e8c", "#a6a6a6", "#a6a6a6", "#a2d9e9", "."],
			[".", ".", "#5d2e8c", "#5d2e8c", "#a2d9e9", "#a2d9e9", ".", "."],
			[".", ".", ".", "#5d2e8c", "#a2d9e9", ".", ".", "."]
		]);
	});
});
