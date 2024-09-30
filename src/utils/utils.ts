import { type Board, type BoardCell, type CellValue, type Square, CellOriginValue, type Shape, type Position } from "@/game/types";
import { Shape1 } from "@/game/blocks/shape-1";
import { Shape2 } from "@/game/blocks/shape-2";
import { Shape3 } from "@/game/blocks/shape-3";
import { Shape4 } from "@/game/blocks/shape-4";
import { Shape5 } from "@/game/blocks/shape-5";
import { Shape6 } from "@/game/blocks/shape-6";
import { Shape7 } from "@/game/blocks/shape-7";
import type { Block } from "@/game/blocks/block";

// const ShapeTable: { new (): Block }[] = [Shape1, Shape2, Shape3, Shape4, Shape5, Shape6, Shape7];
export const ShapeTable: { new(): Block }[] = [Shape1, Shape5];

export function getRandomShape() {
	const index = Math.floor(Math.random() * ShapeTable.length);
	return ShapeTable[index];
}

export function buildShape(width: number, height: number) {
	const shape = new Array(height);

	for (let i = 0; i < height; i++) {
		shape[i] = new Array(width).fill(0);
	}

	return shape;
}

export function copyBoard(board: Board) {
	return board.map((row) => row.map((cell) => ({ ...cell })));
}

export function getBoardCellOriginValue(block: BoardCell): CellOriginValue {
	let result = CellOriginValue.Empty;
	block.forEach((block) => {
		result += block.value.origin;
	});
	return result;
}

export function isCollideTwoBoardCell(board_cell_1: BoardCell, board_cell_2: BoardCell) {
	let result = false;
	board_cell_1.forEach((block_1) => {
		board_cell_2.forEach((block_2) => {
			if (isCollideTwoCell(block_1.value, block_2.value)) {
				result = true;
			}
		});
	});

	return result;
}

export function isCollideTwoCell(cell_1: CellValue, cell_2: CellValue) {
	if (cell_1.origin === CellOriginValue.Empty) return false;
	if (cell_2.origin === CellOriginValue.Empty) return false;
	return cell_1.origin + cell_2.origin !== CellOriginValue.Full;
}

export function isCollideShapeAndBoardCell(shape_cell: CellValue, board_cell: BoardCell, block: Block) {
	let result = false;
	board_cell.forEach((cell) => {
		if (cell.block === block) return;
		if (isCollideTwoCell(shape_cell, cell.value)) {
			result = true;
		}
	});

	return result;
}

export function isEmptyBoardCell(board_cell: BoardCell) {
	let result = true;
	board_cell.forEach((block) => {
		if (block.value.origin !== CellOriginValue.Empty) {
			result = false;
		}
	});
	return result;
}

export function calculateScore(square: Square, boards: Board) {
	const size = square.size;
	const { colors, blocks } = getSquareColorsAndBlocks(square, boards);

	return size * size * blocks.length * Math.pow(5, colors.size);
}

export function isSquareValid(square: Square, boards: Board) {
	const { colors } = getSquareColorsAndBlocks(square, boards);
	return colors.size > 1;
}

export function findAllSquares(boards: Board) {
	const height = boards.length;
	const width = boards[0].length;

	const dp: number[][] = Array.from({ length: height }, () => Array(width).fill(0));

	// find all squares
	for (let i = 0; i < height; i++) {
		for (let j = 0; j < width; j++) {
			if (getBoardCellOriginValue(boards[i][j]) === CellOriginValue.Full) {
				// 如果这个格子已填充
				if (i === 0 || j === 0) {
					dp[i][j] = 1; // 边界条件，如果是第一行或第一列
				} else {
					dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]) + 1;
				}
			}
		}
	}

	return dp;
}

export function findMaxValidSquare(boards: Board) {
	const height = boards.length;
	const width = boards[0].length;

	const square_table = findAllSquares(boards);
	let max_square_size = 0;
	let max_squares: Square | undefined = undefined;

	for (let i = 0; i < height; i++) {
		for (let j = 0; j < width; j++) {
			if (isSquareValid({ size: square_table[i][j], bottom_right: [i, j] }, boards)) {
				if (square_table[i][j] > max_square_size) {
					max_square_size = square_table[i][j];
					max_squares = { size: max_square_size, bottom_right: [i, j] };
				}
			}
		}
	}

	return max_squares;
}

export function getSquareColorsAndBlocks(square: Square, boards: Board) {
	const {
		size,
		bottom_right: [bottom, right]
	} = square;
	const colors = new Set();
	const blocks: Block[] = [];

	for (let i = bottom - size + 1; i <= bottom; i++) {
		for (let j = right - size + 1; j <= right; j++) {
			const board_cell = boards[i][j];
			board_cell.forEach((cell) => {
				blocks.push(cell.block);
				colors.add(cell.block.getColor());
			});
		}
	}

	return {
		colors,
		blocks
	};
}

export function squashBlock(block: Block) {
	let is_change = false;
	const shape = block.getShape();
	const width = block.width;
	const height = block.height;

	for (let row = height - 2; row >= 0; row--) {
		for (let col = 0; col < width; col++) {
			const next_row = row + 1;
			if (shape[row][col].origin === CellOriginValue.Empty) continue;
			if (isCollideTwoCell(shape[row][col], shape[next_row][col])) continue;
			shape[next_row][col] = shape[row][col];
			shape[row][col] = { origin: CellOriginValue.Empty };
			is_change = true;
		}
	}

	return is_change;
}

export function isPositionEqual(position1: Position, position2: Position) {
	return position1[0] === position2[0] && position1[1] === position2[1];
}

export function getHistoryMaxScore() {
	const history_max_score = localStorage.getItem("history_max_score");
	return history_max_score ? parseInt(history_max_score) : 0;
}

export function setHistoryMaxScore(score: number) {
	localStorage.setItem("history_max_score", score.toString());
}

export function getElementWidthHeight(element: HTMLElement): [number, number] {
	const { width, height } = element.getBoundingClientRect();
	return [width, height];
}

export function getAdaptCellSize(element_size: [number, number], board_size: [number, number]) {
	const [element_width, element_height] = element_size;
	const [columns, rows] = board_size;
	const cell_width = element_width / columns;
	const cell_height = element_height / rows;

	return Math.min(cell_width, cell_height);
}

export function setBlocksEmpty(blocks: Set<Block>) {
	blocks.forEach((block) => {
		block.setShapeEmpty();
	});
}
