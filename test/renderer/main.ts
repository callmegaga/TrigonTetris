import { CanvasRenderer } from "../../src/game/renderer/canvas/canvas_renderer";
import { ACTIVE_BOARD_ROWS, GAME_BOARD_ROW, GAME_BOARD_CELL_SIZE, GAME_BOARD_COL } from "../../src/game/config";
import { createCoverBoard, clearBoardFromBlocks } from "./tool";
import { calculateSquareScore, findMaxValidSquare, getSquareColorsAndBlocks } from "../../src/utils/utils";

const renderer = new CanvasRenderer(document.getElementById("game") as HTMLElement, document.getElementById("next") as HTMLElement, {
	board_cell_size: GAME_BOARD_CELL_SIZE,
	columns: GAME_BOARD_COL,
	rows: GAME_BOARD_ROW,
	active_board_rows: ACTIVE_BOARD_ROWS
});

const { boards } = createCoverBoard();
renderer.render(boards, null);

const square = findMaxValidSquare(boards, false);
console.log("find cover square: ", square);
const score = calculateSquareScore(boards, square, false);
console.log("score: ", score);

const { blocks: need_clear_blocks } = getSquareColorsAndBlocks(boards, square);
clearBoardFromBlocks(need_clear_blocks, boards);

renderer.renderBlocks(need_clear_blocks, "red");

renderer.renderSquare(boards, square, false).then(() => {
	console.log("finish animation end");
	renderer.renderBlockEffect(boards, need_clear_blocks).then(() => {
		console.log("finish animation end");
	});
});
