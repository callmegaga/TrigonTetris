import { Block } from "./block";
import { CellOriginValue, type Shape } from "@/game/types";


export class Shape1 extends Block {
	constructor() {
		const shape: Shape = [
			[{ origin: CellOriginValue.Empty }, { origin: CellOriginValue.TriangleRightBottom }, { origin: CellOriginValue.TriangleLeftBottom }, { origin: CellOriginValue.Empty }],
			[{ origin: CellOriginValue.TriangleRightBottom }, { origin: CellOriginValue.Full }, { origin: CellOriginValue.Full }, { origin: CellOriginValue.TriangleLeftBottom }]
		];

		super(shape, "#fefe3c");
	}
}
