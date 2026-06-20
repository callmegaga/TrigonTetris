import type { Block } from "@/game/blocks/block";
import { SnapshotBlock } from "@/game/blocks/snapshot_block";
import { Shape1 } from "@/game/blocks/shape-1";
import { Shape2 } from "@/game/blocks/shape-2";
import { Shape4 } from "@/game/blocks/shape-4";
import { Shape5 } from "@/game/blocks/shape-5";
import { Shape6 } from "@/game/blocks/shape-6";
import { Shape7 } from "@/game/blocks/shape-7";
import { drawBlock, drawGrid } from "@/game/renderer/canvas/utils";
import type { Board, Position } from "@/game/types";
import { createBlock } from "@/utils/sample";

const INTRO_COLUMNS = 16;
const INTRO_ROWS = 20;
const INTRO_DURATION_MS = 8200;
const MAIN_SQUARE_OFFSET_X = 5;
const MAIN_SQUARE_OFFSET_Y = 12;
const SPLIT_SQUARE_OFFSET_X = 5;
const SPLIT_SQUARE_1_OFFSET: Position = [1, 1];
const SPLIT_SQUARE_2_OFFSET: Position = [4, 6];
const HOLD_MAIN_UNTIL = 0.12;
const FIRST_SPLIT_START = 0.16;
const FIRST_SPLIT_END = 0.52;
const SECOND_SPLIT_START = 0.56;
const SECOND_SPLIT_END = 0.92;
const BLOCK_STAGGER = 0.08;

const main_square = [createBlock(Shape7, [0 + MAIN_SQUARE_OFFSET_X, 0 + MAIN_SQUARE_OFFSET_Y], "rr"), createBlock(Shape1, [1 + MAIN_SQUARE_OFFSET_X, 0 + MAIN_SQUARE_OFFSET_Y]), createBlock(Shape2, [3 + MAIN_SQUARE_OFFSET_X, 0 + MAIN_SQUARE_OFFSET_Y], "rr"), createBlock(Shape1, [1 + MAIN_SQUARE_OFFSET_X, 2 + MAIN_SQUARE_OFFSET_Y], "rr"), createBlock(Shape6, [3 + MAIN_SQUARE_OFFSET_X, 2 + MAIN_SQUARE_OFFSET_Y], "rf"), createBlock(Shape4, [4 + MAIN_SQUARE_OFFSET_X, 4 + MAIN_SQUARE_OFFSET_Y]), createBlock(Shape5, [0 + MAIN_SQUARE_OFFSET_X, 3 + MAIN_SQUARE_OFFSET_Y]), createBlock(Shape7, [0 + MAIN_SQUARE_OFFSET_X, 1 + MAIN_SQUARE_OFFSET_Y], "r")];

const split_square_1 = [createBlock(Shape1, addPosition([2, 0], SPLIT_SQUARE_1_OFFSET), "rf"), createBlock(Shape1, addPosition([0, 0], SPLIT_SQUARE_1_OFFSET), "rr"), createBlock(Shape5, addPosition([0, 2], SPLIT_SQUARE_1_OFFSET)), createBlock(Shape7, addPosition([0, 0], SPLIT_SQUARE_1_OFFSET), "r")];

const split_square_2 = [createBlock(Shape6, addPosition([0 + SPLIT_SQUARE_OFFSET_X, 0], SPLIT_SQUARE_2_OFFSET), "r"), createBlock(Shape7, addPosition([0 + SPLIT_SQUARE_OFFSET_X, 0], SPLIT_SQUARE_2_OFFSET), "rrf"), createBlock(Shape4, addPosition([0 + SPLIT_SQUARE_OFFSET_X, 2], SPLIT_SQUARE_2_OFFSET)), createBlock(Shape2, addPosition([1 + SPLIT_SQUARE_OFFSET_X, 1], SPLIT_SQUARE_2_OFFSET), "f")];

const intro_board: Board = Array.from({ length: INTRO_ROWS }, () => Array.from({ length: INTRO_COLUMNS }, () => []));
const split_1_animations = buildAnimations(
	[
		{ source: main_square[1], operations: "rf" },
		{ source: main_square[3], operations: "" },
		{ source: main_square[6], operations: "" },
		{ source: main_square[0], operations: "rrr" }
	],
	split_square_1,
	FIRST_SPLIT_START,
	FIRST_SPLIT_END,
	"left"
);
const split_2_animations = buildAnimations(
	[
		{ source: main_square[4], operations: "f" },
		{ source: main_square[7], operations: "rf" },
		{ source: main_square[5], operations: "" },
		{ source: main_square[2], operations: "rrf" }
	],
	split_square_2,
	SECOND_SPLIT_START,
	SECOND_SPLIT_END,
	"right"
);
const all_animations = [...split_1_animations, ...split_2_animations];

type FlightDirection = "left" | "right";
type FlightSprite = {
	image: HTMLCanvasElement;
};

type FlightSource = {
	source: Block;
	operations: string;
};

interface BlockFlight {
	source: Block;
	target: Block;
	operations: string;
	start: number;
	end: number;
	peak: number;
	direction: FlightDirection;
}

export class SampleIntroRenderer {
	private readonly canvas: HTMLCanvasElement;
	private readonly ctx: CanvasRenderingContext2D;
	private readonly board_cell_size: number;
	private readonly on_complete: () => void;
	private readonly flight_sprites = new Map<Block, FlightSprite>();
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
		all_animations.forEach((flight) => {
			if (!this.flight_sprites.has(flight.source)) {
				this.flight_sprites.set(flight.source, createFlightSprite(flight.source, board_cell_size));
			}
		});
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
		this.drawPlacedSplits(progress);
		this.drawMainRemainder(progress);
		this.drawFlights(progress);
	}

	private drawGrid() {
		this.ctx.save();
		this.ctx.globalAlpha = 0.34;
		drawGrid(this.ctx, intro_board, this.board_cell_size, 0);
		this.ctx.restore();
	}

	private drawPlacedSplits(progress: number) {
		split_1_animations.forEach((flight, index) => {
			if (progress >= flight.end) {
				this.drawBlock(getOperatedBlock(flight.source, flight.target.getPosition(), flight.operations));
				return;
			}
			if (progress >= FIRST_SPLIT_END && index === split_1_animations.length - 1) {
				this.drawBlock(getOperatedBlock(flight.source, flight.target.getPosition(), flight.operations));
			}
		});

		split_2_animations.forEach((flight) => {
			if (progress >= flight.end) {
				this.drawBlock(getOperatedBlock(flight.source, flight.target.getPosition(), flight.operations));
			}
		});
	}

	private drawMainRemainder(progress: number) {
		main_square.forEach((block) => {
			const flight = all_animations.find((animation) => animation.source === block);
			if (!flight || progress >= flight.start) return;

			const alpha = progress < HOLD_MAIN_UNTIL ? 1 : 0.82;
			this.drawBlock(block, alpha);
		});
	}

	private drawFlights(progress: number) {
		all_animations.forEach((flight) => {
			if (progress < flight.start || progress >= flight.end) return;
			this.drawFlight(flight, easeInOut(clamp((progress - flight.start) / (flight.end - flight.start))));
		});
	}

	private drawFlight(flight: BlockFlight, progress: number) {
		const source_position = flight.source.getPosition();
		const target_position = flight.target.getPosition();
		const arc_offset = Math.sin(progress * Math.PI) * flight.peak;
		const drift = flight.direction === "left" ? -0.4 : 0.4;
		const draw_position: Position = [lerp(source_position[0], target_position[0], progress) + drift * Math.sin(progress * Math.PI), lerp(source_position[1], target_position[1], progress) - arc_offset];

		this.drawFloatingBlock(flight.source, draw_position);
	}

	private drawBlock(block: Block, alpha = 1) {
		this.ctx.save();
		this.ctx.globalAlpha = alpha;
		drawBlock(this.ctx, block, this.board_cell_size);
		this.ctx.restore();
	}

	private drawFloatingBlock(block: Block, draw_position: Position) {
		const sprite = this.flight_sprites.get(block);
		if (!sprite) return;
		const pixel_x = Math.round(draw_position[0] * this.board_cell_size);
		const pixel_y = Math.round(draw_position[1] * this.board_cell_size);

		this.ctx.drawImage(sprite.image, pixel_x, pixel_y);
	}

	private clear() {
		this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
	}
}

function buildAnimations(sources: FlightSource[], targets: Block[], start: number, end: number, direction: FlightDirection): BlockFlight[] {
	const available = Math.max(end - start - BLOCK_STAGGER * (targets.length - 1), 0.08);
	return targets.map((target, index) => {
		const flight_source = sources[index];
		return {
			source: flight_source.source,
			target,
			operations: flight_source.operations,
			start: start + index * BLOCK_STAGGER,
			end: start + index * BLOCK_STAGGER + available,
			peak: direction === "left" ? 1.6 + index * 0.18 : 1.2 + index * 0.22,
			direction
		};
	});
}

function getOperatedBlock(source: Block, position: Position, operations: string) {
	const block = new SnapshotBlock(source.getShape(), source.getColor(), position);
	for (const operation of operations) {
		if (operation === "r") block.rotate();
		if (operation === "f") block.flip();
	}
	block.setPosition(position);
	return block;
}

function createFlightSprite(block: Block, board_cell_size: number): FlightSprite {
	const image = document.createElement("canvas");
	image.width = block.width * board_cell_size;
	image.height = block.height * board_cell_size;

	const ctx = image.getContext("2d") as CanvasRenderingContext2D;
	drawBlock(ctx, new SnapshotBlock(block.getShape(), block.getColor(), [0, 0]), board_cell_size);

	return {
		image
	};
}

function addPosition(position: Position, offset: Position): Position {
	return [position[0] + offset[0], position[1] + offset[1]];
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
