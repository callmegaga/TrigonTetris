import type { Block } from "@/game/blocks/block";
import { type Board, CellOriginValue } from "@/game/types";

export abstract class Renderer {
	protected container: HTMLElement;

	protected constructor(dom: HTMLElement, options: { block_size: number; columns: number; rows: number }) {
		this.container = dom;
	}

	abstract render(board: Board, active_block: Block | null): void;
}
