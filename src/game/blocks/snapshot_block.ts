import { Block } from "@/game/blocks/block";
import type { Position, Shape } from "@/game/types";
import { clonePosition, cloneShape, type SnapshotBlock as SnapshotBlockData } from "@/feedback/types";

export class SnapshotBlock extends Block {
	constructor(shape: Shape, color: string, position: Position = [0, 0]) {
		super(cloneShape(shape), color);
		this.setPosition(clonePosition(position));
	}

	static fromSnapshot(block: SnapshotBlockData) {
		return new SnapshotBlock(block.shape, block.color, block.position);
	}
}
