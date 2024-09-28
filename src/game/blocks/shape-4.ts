import { Block } from "./block";
import { CellOriginValue, type Shape } from "@/game/types";

export class Shape4 extends Block {
	constructor() {
		const shape: Shape = [[{ origin: CellOriginValue.Full }]];

		super(shape, "#a6a6a6");
	}
}
