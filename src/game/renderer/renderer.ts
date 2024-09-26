import type { Block } from "@/game/blocks/block";
import { type Board, CellOriginValue, type Square } from "@/game/types";

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
		}
	) {
		this.game_container = game_dom;
		this.next_container = next_dom;
	}

	abstract render(board: Board, active_block: Block | null): void;

	abstract renderNextBlock(blocks: Block[]): void;

	abstract renderSquareEffect(square: Square, boards: Board): Promise<void>;
}
