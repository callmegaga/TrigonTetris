import type { Block } from "@/game/blocks/block";
import { type BevelledSquare, type Board, type NormalSquare } from "@/game/types";

export abstract class Renderer {
	protected game_container: HTMLElement;
	protected next_container: HTMLElement;

	protected constructor(
		game_dom: HTMLElement,
		next_dom: HTMLElement,
		options: {
			board_cell_size: number;
			columns: number;
			rows: number;
			active_board_rows: number;
		}
	) {
		this.game_container = game_dom;
		this.next_container = next_dom;
	}

	abstract render(board: Board, active_block: Block | null): void;

	abstract renderBlocks(blocks: Set<Block>, color?: string): void;

	abstract renderNextBlock(blocks: Block[]): void;

	abstract renderBlockEffect(boards: Board, blocks: Set<Block>): Promise<void>;

	abstract renderSpreadLight(boards: Board, square: NormalSquare | BevelledSquare): Promise<void>;

	abstract renderSquare(boards: Board, square: NormalSquare | BevelledSquare, is_perfect: boolean): Promise<void>;


}
