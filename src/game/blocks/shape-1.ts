import { Block } from "./block";
import { CellValue, type Shape } from "@/game/types";

export class Shape1 extends Block {
	constructor() {
		const shape: Shape = [
			[CellValue.Empty, CellValue.TriangleRightBottom, CellValue.TriangleLeftBottom, CellValue.Empty],
			[CellValue.TriangleRightBottom, CellValue.Full, CellValue.Full, CellValue.TriangleLeftBottom]
		];

		super(shape, "#fefe3c");
	}
}
