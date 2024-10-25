import { Block } from "./block";
import { CellValue, type Shape } from "@/game/types";

export class Shape3 extends Block {
	constructor() {
		const shape: Shape = [
			[CellValue.Full, CellValue.Full],
			[CellValue.Full, CellValue.Full]
		];

		super(shape, "#a6a6a6");
	}
}
