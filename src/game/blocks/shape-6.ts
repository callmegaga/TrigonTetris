import { Block } from "./block";
import { CellOriginValue, type Shape } from "@/game/types";

export class Shape6 extends Block {
	constructor() {
		const shape: Shape = [
			[{ origin: CellOriginValue.Empty }, { origin: CellOriginValue.TriangleRightBottom }, { origin: CellOriginValue.TriangleLeftBottom }, { origin: CellOriginValue.Empty }],
			[{ origin: CellOriginValue.TriangleRightBottom }, { origin: CellOriginValue.Full }, { origin: CellOriginValue.Empty }, { origin: CellOriginValue.Empty }]
		];

		super(shape, "#3db056");
	}
}
