import { Block } from "./block";
import { CellValue, type Shape } from "@/game/types";

export class Shape4 extends Block {
	constructor() {
		const shape: Shape = [[CellValue.Full]];

		super(shape, "#a6a6a6");
	}
}
