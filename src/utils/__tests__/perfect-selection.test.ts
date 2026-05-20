import { describe, expect, it } from "vitest";
import { type Board, type BoardCellValue, CellValue, SquareType } from "@/game/types";
import { calculateSquareScore, findBestPerfectSquare } from "@/utils/utils";
import type { Block } from "@/game/blocks/block";

function createTestBlock(color: string, cells: [number, number][] = []): Block {
	return {
		getColor: () => color,
		isInSquare: (square) => {
			const [bottom, right] = square.bottom_right;
			const top = bottom - square.size + 1;
			const left = right - square.size + 1;
			return cells.every(([y, x]) => y >= top && y <= bottom && x >= left && x <= right);
		}
	} as Block;
}

function createBoard(rows: number, columns: number): Board {
	return Array.from({ length: rows }, () => Array.from({ length: columns }, () => []));
}

function addFullCell(board: Board, y: number, x: number, color: string) {
	board[y][x].push({
		value: CellValue.Full,
		block: createTestBlock(color, [[y, x]])
	});
}

function addNormalSquare(board: Board, top: number, left: number, size: number, colors: string[]) {
	for (let y = top; y < top + size; y++) {
		for (let x = left; x < left + size; x++) {
			const color_index = (x - left + y - top) % colors.length;
			addFullCell(board, y, x, colors[color_index]);
		}
	}
}

function addTriangleCell(board: Board, y: number, x: number, value: BoardCellValue, color: string) {
	board[y][x].push({
		value,
		block: createTestBlock(color)
	});
}

function addBevelledSquare(board: Board, top: number, x: number, colors: string[]) {
	const nextColor = (() => {
		let index = 0;
		return () => colors[index++ % colors.length];
	})();

	addTriangleCell(board, top, x, CellValue.TriangleRightBottom, nextColor());
	addTriangleCell(board, top, x + 1, CellValue.TriangleLeftBottom, nextColor());
	addTriangleCell(board, top + 1, x - 1, CellValue.TriangleRightBottom, nextColor());
	addTriangleCell(board, top + 1, x + 2, CellValue.TriangleLeftBottom, nextColor());
	addFullCell(board, top + 1, x, nextColor());
	addFullCell(board, top + 1, x + 1, nextColor());
	addFullCell(board, top + 2, x, nextColor());
	addFullCell(board, top + 2, x + 1, nextColor());
	addTriangleCell(board, top + 2, x - 1, CellValue.TriangleRightTop, nextColor());
	addTriangleCell(board, top + 2, x + 2, CellValue.TriangleLeftTop, nextColor());
	addTriangleCell(board, top + 3, x, CellValue.TriangleRightTop, nextColor());
	addTriangleCell(board, top + 3, x + 1, CellValue.TriangleLeftTop, nextColor());
}

describe("findBestPerfectSquare", () => {
	it("selects a higher scoring normal square over a lower scoring bevelled square", () => {
		const board = createBoard(10, 10);
		addBevelledSquare(board, 0, 2, ["bevelled-a", "bevelled-b"]);
		addNormalSquare(board, 5, 5, 3, ["normal-a", "normal-b", "normal-c"]);

		const square = findBestPerfectSquare(board);

		expect(square).toEqual({
			type: SquareType.normal,
			size: 3,
			bottom_right: [7, 7]
		});
		expect(square ? calculateSquareScore(board, square, true) : 0).toBe(810);
	});

	it("selects a higher scoring bevelled square over a lower scoring normal square", () => {
		const board = createBoard(10, 10);
		addNormalSquare(board, 5, 5, 3, ["normal-a", "normal-b"]);
		addBevelledSquare(board, 0, 2, ["bevelled-a", "bevelled-b", "bevelled-c"]);

		const square = findBestPerfectSquare(board);

		expect(square).toEqual({
			type: SquareType.bevelled,
			size: 2,
			top_left: [0, 2]
		});
		expect(square ? calculateSquareScore(board, square, true) : 0).toBe(1920);
	});

	it("keeps the lower candidate when perfect scores are tied", () => {
		const board = createBoard(10, 10);
		addNormalSquare(board, 0, 0, 3, ["top-a", "top-b"]);
		addNormalSquare(board, 5, 0, 3, ["bottom-a", "bottom-b"]);

		const square = findBestPerfectSquare(board);

		expect(square).toEqual({
			type: SquareType.normal,
			size: 3,
			bottom_right: [7, 2]
		});
		expect(square ? calculateSquareScore(board, square, true) : 0).toBe(81);
	});
});
