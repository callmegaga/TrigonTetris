import type { Block } from "@/game/blocks/block";
import { drawBlock, drawGrid } from "@/game/renderer/canvas/utils";
import { MAX_SHAPE_SIZE, STAND_BY_COUNT } from "@/game/config";
import type { Board } from "@/game/types";

const next_size = [MAX_SHAPE_SIZE[0] * STAND_BY_COUNT + 3, MAX_SHAPE_SIZE[1] + 2];
const next_board: Board = Array(next_size[1])
	.fill(0)
	.map(() => new Array(next_size[0]).fill(0).map(() => []));

export class NextRenderer {
	private container: HTMLElement;
	private readonly ctx: CanvasRenderingContext2D;
	private readonly board_cell_size: number;

	constructor(container: HTMLElement, board_cell_size: number) {
		this.board_cell_size = board_cell_size;

		this.container = container;
		const next_canvas = document.createElement("canvas");
		this.ctx = next_canvas.getContext("2d") as CanvasRenderingContext2D;
		next_canvas.width = next_size[0] * board_cell_size;
		next_canvas.height = next_size[1] * board_cell_size;

		this.container.appendChild(next_canvas);
	}

	render(blocks: Block[]) {
		this.clear();
		drawGrid(this.ctx, next_board, this.board_cell_size, 0);
		blocks.forEach((block, index) => {
			const [x, y] = block.getPosition();
			console.log(x, y);
			block.setPosition([1 + (1 + MAX_SHAPE_SIZE[0]) * index, 1]);
			drawBlock(this.ctx, block, this.board_cell_size);
			block.setPosition([x, 0]);
		});
	}

	private clear() {
		this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
	}
}
