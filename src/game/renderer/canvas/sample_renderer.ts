import type { Block } from "@/game/blocks/block";
import { drawBlock, drawGrid } from "@/game/renderer/canvas/utils";
import type { Board } from "@/game/types";

export class SampleRenderer {
	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;
	private board_cell_size = 30;

	constructor(board_cell_size: number) {
		this.canvas = document.createElement("canvas");
		this.ctx = this.canvas.getContext("2d")!;
		this.board_cell_size = board_cell_size;
	}

	public drawSample(blocks: Block[]) {
		this.canvas.width = 100;
		this.canvas.height = 100;
		this.clear();

		const width = this.getWidth(blocks);

		this.canvas.width = width * this.board_cell_size;
		this.canvas.height = width * this.board_cell_size;

		const board: Board = Array(width)
			.fill(0)
			.map(() => new Array(width).fill(0).map(() => []));
		drawGrid(this.ctx, board, this.board_cell_size, 0);

		blocks.forEach((block) => {
			drawBlock(this.ctx, block, this.board_cell_size);
		});
		return this.canvas.toDataURL("image/png");
	}

	private clear() {
		this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
	}

	private getWidth(blocks: Block[]): number {
		let width = 0;
		blocks.forEach((block) => {
			const [x] = block.getPosition();
			const shape = block.getShape();
			const blockWidth = x + shape[0].length;
			if (blockWidth > width) {
				width = blockWidth;
			}
		});
		return width;
	}
}
