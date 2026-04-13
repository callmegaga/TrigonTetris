import { CanvasRenderer } from "@/game/renderer/canvas/renderer";
import { NextRenderer } from "@/game/renderer/canvas/next_renderer";
import { ACTIVE_BOARD_ROWS, GAME_BOARD_COL, GAME_BOARD_ROW } from "@/game/config";
import type { Block } from "@/game/blocks/block";
import type { GameSnapshot, SnapshotBlock as SnapshotBlockData } from "@/feedback/types";
import type { Board, Position, Shape } from "@/game/types";

export function renderSnapshot(
	snapshot: GameSnapshot,
	gameContainer: HTMLElement,
	nextContainer: HTMLElement,
	boardCellSize: number
) {
	gameContainer.replaceChildren();
	nextContainer.replaceChildren();

	const renderer = new CanvasRenderer(gameContainer, {
		board_cell_size: boardCellSize,
		columns: GAME_BOARD_COL,
		rows: GAME_BOARD_ROW,
		active_board_rows: ACTIVE_BOARD_ROWS
	});
	const nextRenderer = new NextRenderer(nextContainer, boardCellSize * 0.8);

	const board = buildBoardFromSnapshot(snapshot);
	const activeBlock = snapshot.activeBlock ? createRenderableBlock(snapshot.activeBlock) : null;
	const nextBlocks = snapshot.nextBlocks.map((block) => createRenderableBlock(block));

	renderer.render(board, activeBlock);
	nextRenderer.render(nextBlocks);
}

function buildBoardFromSnapshot(snapshot: GameSnapshot): Board {
	return snapshot.board.map((row, y) =>
		row.map((cell, x) =>
			cell.map((fragment) => ({
				value: fragment.value,
				block: createRenderableBlock({
					shape: [[fragment.value]],
					color: fragment.color,
					position: [x, y]
				})
			}))
		)
	);
}

function createRenderableBlock(block: SnapshotBlockData): Block {
	let position: Position = [block.position[0], block.position[1]];
	const shape: Shape = block.shape.map((row) => [...row]);
	const color = block.color;

	return {
		getShape() {
			return shape;
		},
		getColor() {
			return color;
		},
		getPosition() {
			return position;
		},
		setPosition(nextPosition: Position) {
			position = [nextPosition[0], nextPosition[1]];
		}
	} as unknown as Block;
}
