import { Block } from "./block";
import { CellOriginValue, type Shape } from "@/game/types";

const shape: Shape = [
	[{ origin: CellOriginValue.Full }, { origin: CellOriginValue.Full }],
	[{ origin: CellOriginValue.Full }, { origin: CellOriginValue.Full }]
];

export class Shape3 extends Block {
	constructor() {
		super(shape, "#a6a6a6");
	}
}
