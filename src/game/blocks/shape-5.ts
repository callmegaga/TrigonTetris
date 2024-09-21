import { Block } from "./block";
import { CellOriginValue, type Shape } from "@/game/types";

const shape: Shape = [
	[{ origin: CellOriginValue.Full }, { origin: CellOriginValue.Full }, { origin: CellOriginValue.Full }, { origin: CellOriginValue.Full }],
	[{ origin: CellOriginValue.Full }, { origin: CellOriginValue.Full }, { origin: CellOriginValue.Full }, { origin: CellOriginValue.Full }],
	[{ origin: CellOriginValue.Full }, { origin: CellOriginValue.Full }, { origin: CellOriginValue.TriangleRightTop }, { origin: CellOriginValue.Full }],
	[{ origin: CellOriginValue.Full }, { origin: CellOriginValue.Full }, { origin: CellOriginValue.Empty }, { origin: CellOriginValue.TriangleRightTop }]
];

export class Shape5 extends Block {
	constructor() {
		super(shape, "#f799fc");
	}
}
