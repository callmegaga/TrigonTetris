import { Block } from "./block";
import { CellValue, type Shape } from "@/game/types";

export class Shape5 extends Block {
	constructor() {
		const shape: Shape = [
			[CellValue.Full, CellValue.Full, CellValue.Full],
			[CellValue.Full, CellValue.TriangleRightTop, CellValue.Full],
			[CellValue.Full, CellValue.Empty, CellValue.TriangleRightTop],
		];

		super(shape, "#f799fc");
	}
}
