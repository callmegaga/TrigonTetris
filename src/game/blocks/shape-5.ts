import { Block } from "./block";
import { CellOriginValue, type Shape } from "@/game/types";

export class Shape5 extends Block {
	constructor() {
		const shape: Shape = [
			[{ origin: CellOriginValue.Full }, { origin: CellOriginValue.Full }, { origin: CellOriginValue.Full }, { origin: CellOriginValue.Full }],
			[{ origin: CellOriginValue.Full }, { origin: CellOriginValue.Full }, { origin: CellOriginValue.Full }, { origin: CellOriginValue.Full }],
			[{ origin: CellOriginValue.Full }, { origin: CellOriginValue.Full }, { origin: CellOriginValue.TriangleRightTop }, { origin: CellOriginValue.Full }],
			[{ origin: CellOriginValue.Full }, { origin: CellOriginValue.Full }, { origin: CellOriginValue.Empty }, { origin: CellOriginValue.TriangleRightTop }]
		];

		super(shape, "#f799fc");
	}
}
