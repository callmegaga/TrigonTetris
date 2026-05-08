import { describe, expect, it } from "vitest";
import { type Board, type BoardCellValue, CellValue, SquareType } from "@/game/types";
import { findMaxValidBevelledSquare, findMaxValidSquare } from "@/utils/utils";
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

function addNormalSquare(board: Board, top: number, left: number, size: number, colorPrefix: string) {
	for (let y = top; y < top + size; y++) {
		for (let x = left; x < left + size; x++) {
			addFullCell(board, y, x, `${colorPrefix}-${(x + y) % 2}`);
		}
	}
}

function addTriangleCell(board: Board, y: number, x: number, value: BoardCellValue, color: string) {
	board[y][x].push({
		value,
		block: createTestBlock(color)
	});
}

function addBevelledSquare(board: Board, top: number, x: number, colorPrefix: string) {
	addTriangleCell(board, top, x, CellValue.TriangleRightBottom, `${colorPrefix}-a`);
	addTriangleCell(board, top, x + 1, CellValue.TriangleLeftBottom, `${colorPrefix}-b`);
	addTriangleCell(board, top + 1, x - 1, CellValue.TriangleRightBottom, `${colorPrefix}-c`);
	addTriangleCell(board, top + 1, x + 2, CellValue.TriangleLeftBottom, `${colorPrefix}-d`);
	addFullCell(board, top + 1, x, `${colorPrefix}-e`);
	addFullCell(board, top + 1, x + 1, `${colorPrefix}-f`);
	addFullCell(board, top + 2, x, `${colorPrefix}-g`);
	addFullCell(board, top + 2, x + 1, `${colorPrefix}-h`);
	addTriangleCell(board, top + 2, x - 1, CellValue.TriangleRightTop, `${colorPrefix}-i`);
	addTriangleCell(board, top + 2, x + 2, CellValue.TriangleLeftTop, `${colorPrefix}-j`);
	addTriangleCell(board, top + 3, x, CellValue.TriangleRightTop, `${colorPrefix}-k`);
	addTriangleCell(board, top + 3, x + 1, CellValue.TriangleLeftTop, `${colorPrefix}-l`);
}

describe("cover selection", () => {
	it("selects the lower normal square when same type and same area cover candidates exist", () => {
		const board = createBoard(7, 4);
		addNormalSquare(board, 0, 0, 3, "top");
		addNormalSquare(board, 4, 0, 3, "bottom");

		expect(findMaxValidSquare(board, false)).toEqual({
			type: SquareType.normal,
			size: 3,
			bottom_right: [6, 2]
		});
	});

	it("selects the lower normal square when same type and same area perfect candidates exist", () => {
		const board = createBoard(7, 4);
		addNormalSquare(board, 0, 0, 3, "top");
		addNormalSquare(board, 4, 0, 3, "bottom");

		expect(findMaxValidSquare(board, true)).toEqual({
			type: SquareType.normal,
			size: 3,
			bottom_right: [6, 2]
		});
	});

	it("selects the lower bevelled square when same type and same area cover candidates exist", () => {
		const board = createBoard(9, 6);
		addBevelledSquare(board, 0, 2, "top");
		addBevelledSquare(board, 5, 2, "bottom");

		expect(findMaxValidBevelledSquare(board, false)).toEqual({
			type: SquareType.bevelled,
			size: 2,
			top_left: [5, 2]
		});
	});

	it("selects the lower bevelled square when same type and same area perfect candidates exist", () => {
		const board = createBoard(9, 6);
		addBevelledSquare(board, 0, 2, "top");
		addBevelledSquare(board, 5, 2, "bottom");

		expect(findMaxValidBevelledSquare(board, true)).toEqual({
			type: SquareType.bevelled,
			size: 2,
			top_left: [5, 2]
		});
	});
});
