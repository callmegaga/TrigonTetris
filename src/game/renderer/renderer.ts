import type { Block } from "@/game/blocks/block";
import { type BevelledSquare, type Board, type NormalSquare } from "@/game/types";

interface RendererOptions {
	game_dom: HTMLElement;
	next_dom: HTMLElement;
	options: {
		board_cell_size: number;
		columns: number;
		rows: number;
		active_board_rows: number;
	};
}

export abstract class Renderer {
	protected game_container: HTMLElement;
	protected next_container: HTMLElement;
	protected readonly board_cell_size: number;
	protected readonly active_board_rows: number;

	protected constructor({ game_dom, next_dom, options }: RendererOptions) {
		this.game_container = game_dom;
		this.next_container = next_dom;
		this.board_cell_size = options.board_cell_size;
		this.active_board_rows = options.active_board_rows;
	}

	abstract render(board: Board, active_block: Block | null): void;

	abstract renderBlocks(blocks: Set<Block>, color?: string): void;

	abstract renderNext(blocks: Block[]): void;

	abstract renderBlockEffect(boards: Board, blocks: Set<Block>): Promise<void>;

	abstract renderSpreadLight(boards: Board, square: NormalSquare | BevelledSquare): Promise<void>;

	abstract renderSquare(boards: Board, square: NormalSquare | BevelledSquare, is_perfect: boolean): Promise<void>;
}

export abstract class NextRenderer {}

export abstract class SampleRenderer {}

export abstract class EffectRenderer {}
