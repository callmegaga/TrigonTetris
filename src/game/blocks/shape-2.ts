import { Block } from "./block";
import { CellValue, type Shape } from "@/game/types";

export class Shape2 extends Block {
	constructor() {
		const shape: Shape = [
			[CellValue.TriangleLeftBottom, CellValue.Empty],
			[CellValue.Full, CellValue.TriangleLeftBottom]
		];

		super(shape, "#a2d9e9");
	}
}
