import { Block } from "./block";
import { CellOriginValue, type Shape } from "@/game/types";

const shape: Shape = [
	[{ origin: CellOriginValue.Empty }, { origin: CellOriginValue.TriangleRightBottom }, { origin: CellOriginValue.TriangleLeftBottom }],
	[{ origin: CellOriginValue.TriangleRightBottom }, { origin: CellOriginValue.Full }, { origin: CellOriginValue.Full }]
];

export class Shape7 extends Block {
	constructor() {
		super(shape, "#f8bf2d");
	}
}
