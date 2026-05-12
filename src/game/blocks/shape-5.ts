import { Block } from "./block";
import { CellValue, type Shape } from "@/game/types";

export class Shape5 extends Block {
	constructor() {
		const shape: Shape = [
			[CellValue.Empty, CellValue.Full, CellValue.Full],
			[CellValue.Empty, CellValue.TriangleRightTop, CellValue.Full],
			[CellValue.Empty, CellValue.Empty, CellValue.TriangleRightTop]
		];

		super(shape, "#f799fc");
	}
}
