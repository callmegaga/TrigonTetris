import { Block } from "./block";
import { CellOriginValue, type Shape } from "@/game/types";

const shape: Shape = [
	[{ origin: CellOriginValue.Empty }, { origin: CellOriginValue.TriangleRightBottom }, { origin: CellOriginValue.TriangleLeftBottom }, { origin: CellOriginValue.Empty }],
	[{ origin: CellOriginValue.TriangleRightBottom }, { origin: CellOriginValue.Full }, { origin: CellOriginValue.Empty }, { origin: CellOriginValue.Empty }]
];

export class Shape6 extends Block {
	constructor() {
		super(shape, "#3db056");
	}
}
