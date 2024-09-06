import { Block } from "./block";
import { CellValue, type Shape } from "@/game/types";

const shape: Shape = [
	[CellValue.Full]
];

export class Shape4 extends Block {
	constructor() {
		super(shape, "#a6a6a6");
	}
}
