import { Block } from "./block";
import { CellOriginValue, type Shape } from "@/game/types";

export class Shape3 extends Block {
	constructor() {
		const shape: Shape = [
			[{ origin: CellOriginValue.Full }, { origin: CellOriginValue.Full }],
			[{ origin: CellOriginValue.Full }, { origin: CellOriginValue.Full }]
		];

		super(shape, "#a6a6a6");
	}
}
