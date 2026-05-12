import { Block } from "./block";
import { CellValue, type Shape } from "@/game/types";

export class Shape5 extends Block {
	constructor() {
		const shape: Shape = [
			[CellValue.Empty, CellValue.TriangleRightBottom, CellValue.TriangleLeftBottom, CellValue.Empty],
			[CellValue.Full, CellValue.Full, CellValue.Full, CellValue.TriangleLeftBottom]
		];

		super(shape, "#f799fc");
	}
}
