import { Block } from "./block";
import { CellOriginValue, type Shape } from "@/game/types";

const shape: Shape = [
	[{ origin: CellOriginValue.Empty }, { origin: CellOriginValue.TriangleRightBottom }, { origin: CellOriginValue.TriangleLeftBottom }, { origin: CellOriginValue.Empty }],
	[{ origin: CellOriginValue.TriangleRightBottom }, { origin: CellOriginValue.Full }, { origin: CellOriginValue.Full }, { origin: CellOriginValue.TriangleLeftBottom }]
];

export class Shape1 extends Block {
	constructor() {
		super(shape, "#fefe3c");
	}
}
