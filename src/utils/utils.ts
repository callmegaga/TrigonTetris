import { type BevelledSquare, type Board, type BoardCell, CellValue, type Color, type Position, type NormalSquare, SquareType } from "@/game/types";
import { Shape1 } from "@/game/blocks/shape-1";
import { Shape2 } from "@/game/blocks/shape-2";
import { Shape3 } from "@/game/blocks/shape-3";
import { Shape4 } from "@/game/blocks/shape-4";
import { Shape5 } from "@/game/blocks/shape-5";
import { Shape6 } from "@/game/blocks/shape-6";
import { Shape7 } from "@/game/blocks/shape-7";
import type { Block } from "@/game/blocks/block";

const ShapeTable: { new (): Block }[] = [Shape1, Shape2, Shape3, Shape4, Shape5, Shape6, Shape7];

export function getRandomShape() {
	// 概率5-4-4-1-3-5-5
	const random = Math.random();
	const sum = 5 + 4 + 4 + 1 + 3 + 3 + 5;
	if (random <= 5 / sum) return ShapeTable[0];
	if (random <= (5 + 4) / sum) return ShapeTable[1];
	if (random <= (5 + 4 + 4) / sum) return ShapeTable[2];
	if (random <= (5 + 4 + 4 + 1) / sum) return ShapeTable[3];
	if (random <= (5 + 4 + 4 + 1 + 3) / sum) return ShapeTable[4];
	if (random <= (5 + 4 + 4 + 1 + 3 + 3) / sum) return ShapeTable[5];
	return ShapeTable[6];
}

export function buildShape(width: number, height: number) {
	const shape = new Array(height);

	for (let i = 0; i < height; i++) {
		shape[i] = new Array(width).fill(0);
	}

	return shape;
}

export function copyBoard(board: Board) {
	return board.map((row) =>
		row.map((cell) =>
			cell.map((block) => {
				return { value: block.value, block: block.block };
			})
		)
	);
}

export function boardEraseBlock(board: Board, block: Block) {
	const height = board.length;
	const width = board[0].length;
	for (let i = 0; i < height; i++) {
		for (let j = 0; j < width; j++) {
			const board_cell = board[i][j];
			board[i][j] = board_cell.filter((cell) => cell.block !== block);
		}
	}
}

export function getBoardCellValue(block: BoardCell): CellValue {
	let result = CellValue.Empty;
	block.forEach((block) => {
		result += block.value;
	});
	return result;
}

export function isCollideTwoCell(cell_1: CellValue, cell_2: CellValue) {
	if (cell_1 === CellValue.Empty) return false;
	if (cell_2 === CellValue.Empty) return false;
	return cell_1 + cell_2 !== CellValue.Full;
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
	return board_cell.length === 0;
}

export function calculateSquareScore(boards: Board, square: NormalSquare | BevelledSquare, is_perfect: boolean) {
	if (is_perfect) {
		if (square.type === SquareType.normal) {
			const size = square.size;
			const { colors, blocks } = getSquareColorsAndBlocks(boards, square);

			return size * size * blocks.size * Math.pow(5, colors.size);
		} else {
			const size = square.size;
			const { colors, blocks } = getBevelledSquareColorsAndBlocks(boards, square);

			return Math.pow(2 * size * size, 2) * blocks.size * Math.pow(5, colors.size);
		}
	} else {
		if (square.type === SquareType.normal) {
			const size = square.size;
			const { colors } = getSquareColorsAndBlocks(boards, square);

			return size * size * colors.size;
		} else {
			const size = square.size;
			const { colors } = getBevelledSquareColorsAndBlocks(boards, square);

			return 2 * size * size * colors.size;
		}
	}
}

export function isSquareValid(boards: Board, square: NormalSquare) {
	const { colors } = getSquareColorsAndBlocks(boards, square);
	return colors.size > 1;
}

export function isSquarePerfect(boards: Board, square: NormalSquare) {
	const { blocks } = getSquareColorsAndBlocks(boards, square);
	let result = true;
	blocks.forEach((block) => {
		if (!block.isInSquare(square)) {
			result = false;
		}
	});
	return result;
}

export function isBevelledSquareValid(boards: Board, bevelled_square: BevelledSquare) {
	const { colors } = getBevelledSquareColorsAndBlocks(boards, bevelled_square);
	return colors.size > 1;
}

export function findAllSquares(boards: Board) {
	const height = boards.length;
	const width = boards[0].length;

	const dp: number[][] = Array.from({ length: height }, () => Array(width).fill(0));

	// find all squares
	for (let i = 0; i < height; i++) {
		for (let j = 0; j < width; j++) {
			if (getBoardCellValue(boards[i][j]) === CellValue.Full) {
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

export function findMaxValidSquare(boards: Board, is_perfect: boolean) {
	const height = boards.length;
	const width = boards[0].length;

	const square_table = findAllSquares(boards);
	let max_square_size = 0;
	let max_squares: NormalSquare | undefined = undefined;

	for (let i = 0; i < height; i++) {
		for (let j = 0; j < width; j++) {
			if (isSquareValid(boards, { type: SquareType.normal, size: square_table[i][j], bottom_right: [i, j] })) {
				if (is_perfect && !isSquarePerfect(boards, { type: SquareType.normal, size: square_table[i][j], bottom_right: [i, j] })) {
					continue;
				}
				if (square_table[i][j] > max_square_size) {
					max_square_size = square_table[i][j];
					max_squares = { type: SquareType.normal, size: max_square_size, bottom_right: [i, j] };
				}
			}
		}
	}

	return max_squares;
}

export function findMaxValidBevelledSquare(boards: Board, is_perfect: boolean) {
	const all_bevelled_square = findAllBevelledSquares(boards, is_perfect).filter((bevelled_square) => isBevelledSquareValid(boards, bevelled_square));

	let max_squares: BevelledSquare | undefined = undefined;
	let max_square_size = 0;

	all_bevelled_square.forEach((bevelled_square) => {
		if (bevelled_square.size > max_square_size) {
			max_squares = bevelled_square;
			max_square_size = bevelled_square.size;
		}
	});
	return max_squares;
}

export function findAllBevelledSquares(boards: Board, is_perfect: boolean) {
	const result: BevelledSquare[] = [];
	const max_bevelled_square_size = Math.min(boards.length, boards[0].length);

	for (let y = 0; y < boards.length - 1; y++) {
		for (let x = 0; x < boards[0].length - 1; x++) {
			const tile = boards[y][x];
			const neighbor_tile = boards[y][x + 1];

			if (tile.length === 0 || neighbor_tile.length === 0) continue;
			if (tile.length === 1 && tile[0].value !== CellValue.Full && tile[0].value !== CellValue.TriangleRightBottom) continue;
			if (neighbor_tile.length === 1 && neighbor_tile[0].value !== CellValue.Full && neighbor_tile[0].value !== CellValue.TriangleLeftBottom) continue;

			for (let size = 1; size <= max_bevelled_square_size; size += 1) {
				if (is_perfect) {
					if (checkBevelledSquaresPerfect(boards, x, y, size)) {
						result.push({ type: SquareType.bevelled, size, top_left: [y, x] });
					}
				} else {
					if (checkBevelledSquaresValid(boards, x, y, size)) {
						result.push({ type: SquareType.bevelled, size, top_left: [y, x] });
					} else {
						break;
					}
				}
			}
		}
	}
	return result;
}

export function checkBevelledSquaresValid(boards: Board, x: number, y: number, size: number) {
	if (x + size >= boards[0].length) return false;
	if (x - size + 1 < 0) return false;
	if (y + 2 * size - 1 >= boards.length) return false;

	for (let i = 0; i < size; i++) {
		//	check left top border
		if (!checkTileHavaValue(boards[y + i][x - i], [CellValue.TriangleRightBottom, CellValue.Full])) {
			return false;
		}

		//	check right top border
		if (!checkTileHavaValue(boards[y + i][x + i + 1], [CellValue.TriangleLeftBottom, CellValue.Full])) {
			return false;
		}

		//	check left bottom border
		if (!checkTileHavaValue(boards[y + 2 * size - 1 - i][x - i], [CellValue.TriangleRightTop, CellValue.Full])) {
			return false;
		}

		//	check right bottom border
		if (!checkTileHavaValue(boards[y + 2 * size - 1 - i][x + i + 1], [CellValue.TriangleLeftTop, CellValue.Full])) {
			return false;
		}

		//	check inside
		if (i > 0) {
			const count = i * 2;
			for (let j = 1; j <= count; j++) {
				if (!checkTileHavaValue(boards[y + i][x - i + j], [CellValue.Full])) {
					return false;
				}
				if (!checkTileHavaValue(boards[y + 2 * size - 1 - i][x - i + j], [CellValue.Full])) {
					return false;
				}
			}
		}
	}
	return true;
}

export function checkBevelledSquaresPerfect(boards: Board, x: number, y: number, size: number) {
	if (x + size >= boards[0].length) return false;
	if (x - size + 1 < 0) return false;
	if (y + 2 * size - 1 >= boards.length) return false;

	for (let i = 0; i < size; i++) {
		//	check left top border
		if (!checkTileHavaValue(boards[y + i][x - i], [CellValue.TriangleRightBottom])) {
			return false;
		}

		//	check right top border
		if (!checkTileHavaValue(boards[y + i][x + i + 1], [CellValue.TriangleLeftBottom])) {
			return false;
		}

		//	check left bottom border
		if (!checkTileHavaValue(boards[y + 2 * size - 1 - i][x - i], [CellValue.TriangleRightTop])) {
			return false;
		}

		//	check right bottom border
		if (!checkTileHavaValue(boards[y + 2 * size - 1 - i][x + i + 1], [CellValue.TriangleLeftTop])) {
			return false;
		}

		//	check inside
		if (i > 0) {
			const count = i * 2;
			for (let j = 1; j <= count; j++) {
				if (!checkTileHavaValue(boards[y + i][x - i + j], [CellValue.Full])) {
					return false;
				}
				if (!checkTileHavaValue(boards[y + 2 * size - 1 - i][x - i + j], [CellValue.Full])) {
					return false;
				}
			}
		}
	}
	return true;
}

export function checkTileHavaValue(tile: BoardCell, value: CellValue[]) {
	let result = false;
	tile.forEach((cell) => {
		if (value.includes(cell.value)) {
			result = true;
		}
	});
	return result;
}

export function getSquareColorsAndBlocks(boards: Board, square: NormalSquare | BevelledSquare) {
	if (square.type === SquareType.normal) {
		return getNormalSquareColorsAndBlocks(boards, square);
	} else {
		return getBevelledSquareColorsAndBlocks(boards, square);
	}
}

export function getNormalSquareColorsAndBlocks(boards: Board, square: NormalSquare) {
	const {
		size,
		bottom_right: [bottom, right]
	} = square;
	const colors = new Set<Color>();
	const blocks = new Set<Block>();

	for (let i = bottom - size + 1; i <= bottom; i++) {
		for (let j = right - size + 1; j <= right; j++) {
			const board_cell = boards[i][j];
			board_cell.forEach((cell) => {
				blocks.add(cell.block);
				colors.add(cell.block.getColor());
			});
		}
	}

	return {
		colors,
		blocks
	};
}

export function getBevelledSquareColorsAndBlocks(boards: Board, bevelled_square: BevelledSquare) {
	const {
		size,
		top_left: [y, x]
	} = bevelled_square;
	const colors = new Set<Color>();
	const blocks = new Set<Block>();

	for (let i = 0; i < size; i++) {
		//	check left top border
		let board_cell = boards[y + i][x - i];
		board_cell.forEach((cell) => {
			blocks.add(cell.block);
			colors.add(cell.block.getColor());
		});

		//	check right top border
		board_cell = boards[y + i][x + i + 1];
		board_cell.forEach((cell) => {
			blocks.add(cell.block);
			colors.add(cell.block.getColor());
		});

		//	check left bottom border
		board_cell = boards[y + 2 * size - 1 - i][x - i];
		board_cell.forEach((cell) => {
			blocks.add(cell.block);
			colors.add(cell.block.getColor());
		});

		//	check right bottom border
		board_cell = boards[y + 2 * size - 1 - i][x + i + 1];
		board_cell.forEach((cell) => {
			blocks.add(cell.block);
			colors.add(cell.block.getColor());
		});

		//	check inside
		if (i > 0) {
			const count = i * 2;
			for (let j = 1; j <= count; j++) {
				board_cell = boards[y + i][x - i + j];
				board_cell.forEach((cell) => {
					blocks.add(cell.block);
					colors.add(cell.block.getColor());
				});

				board_cell = boards[y + 2 * size - 1 - i][x - i + j];
				board_cell.forEach((cell) => {
					blocks.add(cell.block);
					colors.add(cell.block.getColor());
				});
			}
		}
	}

	return {
		colors,
		blocks
	};
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

export function getBevelledSquareMaxSquare(bevelled_square: BevelledSquare): NormalSquare {
	const { size, top_left } = bevelled_square;
	const [y, x] = top_left;
	return { type: SquareType.normal, size: 2 * size, bottom_right: [y + 2 * size - 1, x + size] };
}

export function getSquareCenterPixelPosition(square: NormalSquare | BevelledSquare, board_cell_size: number): [number, number] {
	const result: [number, number] = [0, 0];
	console.log("calculate center square: ", square);

	if (square.type === SquareType.normal) {
		const {
			size,
			bottom_right: [bottom, right]
		} = square;
		result[0] = (size / 2 + right - size + 1) * board_cell_size;
		result[1] = (size / 2 + bottom - size + 1) * board_cell_size;
	} else {
		const {
			size,
			top_left: [y, x]
		} = square;
		result[0] = (x + 1) * board_cell_size;
		result[1] = (y + size) * board_cell_size;
	}
	console.log("center position: ", result);
	return result;
}

export function getElementScreenPosition(element: HTMLElement): [number, number] {
	const { top, left } = element.getBoundingClientRect();
	return [left, top];
}

export function isBoardFirstNLineEmpty(boards: Board, n: number) {
	if (n > boards.length) return false;

	for (let i = 0; i < n; i++) {
		for (let j = 0; j < boards[i].length; j++) {
			if (!isEmptyBoardCell(boards[i][j])) {
				return false;
			}
		}
	}

	return true;
}
