import { Block } from "./block";
import { CellOriginValue, type Shape } from "@/game/types";

export class Shape2 extends Block {
	constructor() {
		const shape: Shape = [
			[{ origin: CellOriginValue.TriangleLeftBottom }, { origin: CellOriginValue.Empty }],
			[{ origin: CellOriginValue.Full }, { origin: CellOriginValue.TriangleLeftBottom }]
		];

		super(shape, "#a2d9e9");
	}
}
