import { SnapshotBlock } from "@/game/blocks/snapshot_block";
import { drawBlock, drawGrid, drawSquareBorder } from "@/game/renderer/canvas/utils";
import { CellValue, SquareType, type Board, type NormalSquare, type Position, type Shape } from "@/game/types";

const INTRO_COLUMNS = 8;
const INTRO_ROWS = 6;
const INTRO_DURATION_MS = 4600;
const FISH_COLOR = "#f8bf2d";
const BODY_COLOR = "#8b5cf6";
const TOP_COLOR = "#5eead4";
const RIGHT_COLOR = "#f472b6";

const intro_board: Board = Array.from({ length: INTRO_ROWS }, () => Array.from({ length: INTRO_COLUMNS }, () => []));

const fish_shape: Shape = [
	[CellValue.TriangleRightBottom, CellValue.Full, CellValue.Full, CellValue.TriangleLeftBottom],
	[CellValue.TriangleRightTop, CellValue.Full, CellValue.Full, CellValue.TriangleLeftTop]
];

const body_shape: Shape = [
	[CellValue.Full, CellValue.Full],
	[CellValue.Full, CellValue.Full]
];

const top_shape: Shape = [[CellValue.Full, CellValue.Full, CellValue.Full]];

const right_shape: Shape = [[CellValue.Full], [CellValue.Full]];

const target_square: NormalSquare = {
	type: SquareType.normal,
	size: 3,
	bottom_right: [3, 4]
};

export class SampleIntroRenderer {
	private readonly canvas: HTMLCanvasElement;
	private readonly ctx: CanvasRenderingContext2D;
	private readonly board_cell_size: number;
	private readonly on_complete: () => void;
	private animation_frame = 0;
	private started_at = 0;
	private is_stopped = true;

	constructor(canvas: HTMLCanvasElement, board_cell_size: number, on_complete: () => void) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
		this.board_cell_size = board_cell_size;
		this.on_complete = on_complete;

		this.canvas.width = INTRO_COLUMNS * board_cell_size;
		this.canvas.height = INTRO_ROWS * board_cell_size;
	}

	play() {
		this.stop();
		this.is_stopped = false;
		this.started_at = performance.now();
		this.draw(0);
		this.animation_frame = window.requestAnimationFrame(this.animate);
	}

	stop() {
		if (this.animation_frame) {
			window.cancelAnimationFrame(this.animation_frame);
			this.animation_frame = 0;
		}
		this.is_stopped = true;
	}

	private animate = (timestamp: number) => {
		if (this.is_stopped) return;

		const elapsed = timestamp - this.started_at;
		this.draw(Math.min(elapsed / INTRO_DURATION_MS, 1));

		if (elapsed >= INTRO_DURATION_MS) {
			this.animation_frame = 0;
			this.is_stopped = true;
			this.on_complete();
			return;
		}

		this.animation_frame = window.requestAnimationFrame(this.animate);
	};

	private draw(progress: number) {
		this.clear();
		this.drawGrid();

		if (progress < 0.58) {
			this.drawChase(progress);
			return;
		}

		if (progress < 0.78) {
			this.drawAssembling(progress);
			return;
		}

		if (progress < 0.9) {
			this.drawCompleteSquare(progress);
			return;
		}

		this.drawErase(progress);
	}

	private drawGrid() {
		this.ctx.save();
		this.ctx.globalAlpha = 0.42;
		drawGrid(this.ctx, intro_board, this.board_cell_size, 0);
		this.ctx.restore();
	}

	private drawChase(progress: number) {
		const move_progress = easeInOut(clamp((progress - 0.06) / 0.38));
		const bite_progress = easeInOut(clamp((progress - 0.4) / 0.16));
		const fish_x = lerp(-1.4, 2, move_progress);
		const food_pull = bite_progress * 0.9;
		const wobble = Math.sin(progress * Math.PI * 18) * (1 - bite_progress) * 0.08;

		this.drawBlock(fish_shape, FISH_COLOR, [fish_x, 2]);
		this.drawBlock(top_shape, withAlpha(TOP_COLOR, 1 - bite_progress * 0.25), [5 - food_pull + wobble, 1]);
		this.drawBlock(right_shape, withAlpha(RIGHT_COLOR, 1 - bite_progress * 0.25), [6 - food_pull, 2 + wobble]);
	}

	private drawAssembling(progress: number) {
		const assemble_progress = easeInOut(clamp((progress - 0.58) / 0.2));
		this.drawSquareBlocks(assemble_progress, 1);
	}

	private drawCompleteSquare(progress: number) {
		this.drawSquareBlocks(1, 1);
		const pulse_progress = clamp((progress - 0.78) / 0.12);
		this.drawSquareOverlay(0.1 + pulse_progress * 0.14);
		drawSquareBorder(this.ctx, target_square, this.board_cell_size);
	}

	private drawErase(progress: number) {
		const fade_progress = clamp((progress - 0.9) / 0.1);
		this.drawSquareBlocks(1, 1 - fade_progress);
		this.drawSquareOverlay((1 - fade_progress) * 0.22);
	}

	private drawSquareBlocks(assemble_progress: number, alpha: number) {
		this.drawBlock(body_shape, withAlpha(BODY_COLOR, alpha), [2, 2]);
		this.drawBlock(top_shape, withAlpha(TOP_COLOR, alpha), [lerp(5, 2, assemble_progress), 1]);
		this.drawBlock(right_shape, withAlpha(RIGHT_COLOR, alpha), [lerp(6, 4, assemble_progress), 2]);
	}

	private drawSquareOverlay(alpha: number) {
		this.ctx.save();
		this.ctx.globalAlpha = alpha;
		this.ctx.fillStyle = "#ef4444";
		this.ctx.fillRect(2 * this.board_cell_size, this.board_cell_size, 3 * this.board_cell_size, 3 * this.board_cell_size);
		this.ctx.restore();
	}

	private drawBlock(shape: Shape, color: string, position: Position) {
		drawBlock(this.ctx, new SnapshotBlock(shape, color, position), this.board_cell_size);
	}

	private clear() {
		this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
	}
}

function clamp(value: number) {
	return Math.min(Math.max(value, 0), 1);
}

function lerp(start: number, end: number, progress: number) {
	return start + (end - start) * progress;
}

function easeInOut(progress: number) {
	return progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
}

function withAlpha(color: string, alpha: number) {
	const normalized_alpha = clamp(alpha);
	const red = Number.parseInt(color.slice(1, 3), 16);
	const green = Number.parseInt(color.slice(3, 5), 16);
	const blue = Number.parseInt(color.slice(5, 7), 16);

	return `rgba(${red}, ${green}, ${blue}, ${normalized_alpha})`;
}
