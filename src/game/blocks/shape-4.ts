import { Block } from "./block";
import { CellOriginValue, type Shape } from "@/game/types";

const shape: Shape = [[{ origin: CellOriginValue.Full }]];

export class Shape4 extends Block {
	constructor() {
		super(shape, "#a6a6a6");
	}
}
