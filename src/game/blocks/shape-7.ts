import { Block } from "./block";
import { CellValue, type Shape } from "@/game/types";

export class Shape7 extends Block {
	constructor() {
		const shape: Shape = [
			[CellValue.Empty, CellValue.TriangleRightBottom, CellValue.TriangleLeftBottom],
			[CellValue.TriangleRightBottom, CellValue.Full, CellValue.Full]
		];

		super(shape, "#f8bf2d");
	}
}
