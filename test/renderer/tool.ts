import { Board, CellValue } from "../../src/game/types";
import { ACTIVE_BOARD_ROWS, GAME_BOARD_COL, GAME_BOARD_ROW } from "../../src/game/config";
import type { Block } from "../../src/game/blocks/block";
import { Shape1 } from "../../src/game/blocks/shape-1";
import { Shape2 } from "../../src/game/blocks/shape-2";
import { Shape3 } from "../../src/game/blocks/shape-3";
import { Shape4 } from "../../src/game/blocks/shape-4";
import { Shape5 } from "../../src/game/blocks/shape-5";
import { Shape6 } from "../../src/game/blocks/shape-6";
import { Shape7 } from "../../src/game/blocks/shape-7";

export function createBoard(): Board {
	const boards = Array(GAME_BOARD_ROW + ACTIVE_BOARD_ROWS)
		.fill(0)
		.map(() => new Array(GAME_BOARD_COL).fill(0).map(() => []));

	return boards;
}

export function createCoverBoard() {
	const boards = createBoard();
	const dead_blocks: Block[] = [];

	let block: Block = new Shape5();
	block.setPosition([3, 24]);
	block.rotateIfNotCollide(boards);
	block.rotateIfNotCollide(boards);
	moveBlockToBoard(block, boards);

	block = new Shape1();
	block.rotateIfNotCollide(boards);
	block.flipIfNotCollide(boards);
	block.setPosition([3, 22]);
	moveBlockToBoard(block, boards);


	block = new Shape2();
	block.setPosition([5, 22]);
	moveBlockToBoard(block, boards);

	block = new Shape3();
	block.setPosition([3, 27]);
	moveBlockToBoard(block, boards);

	block = new Shape3();
	block.setPosition([6, 27]);
	moveBlockToBoard(block, boards);

	block = new Shape4();
	block.setPosition([2, 28]);
	moveBlockToBoard(block, boards);

	block = new Shape1();
	block.rotateIfNotCollide(boards);
	block.flipIfNotCollide(boards);
	block.setPosition([1, 24]);
	moveBlockToBoard(block, boards);

	return { boards, dead_blocks };
}

export function moveBlockToBoard(block: Block, boards: Board) {
	const shape = block.getShape();
	const block_position = block.getPosition();

	shape.forEach((row, y) => {
		row.forEach((cell, x) => {
			if (cell === CellValue.Empty) return;
			boards[y + block_position[1]][x + block_position[0]].push({
				value: cell,
				block: block
			});
		});
	});
}

export function clearBoardFromBlocks(blocks: Set<Block>, boards: Board) {
	blocks.forEach((block) => {
		const position = block.getPosition();
		const shape = block.getShape();
		shape.forEach((row, y) => {
			row.forEach((cell, x) => {
				if (cell === CellValue.Empty) return;

				const board_cell = boards[y + position[1]][x + position[0]];
				boards[y + position[1]][x + position[0]] = board_cell.filter((block_cell) => block_cell.block !== block);
			});
		});
	});
}
