import { Block } from "./block";
import { CellValue, type Shape } from "@/game/types";

export class Shape6 extends Block {
	constructor() {
		const shape: Shape = [
			[CellValue.Empty, CellValue.TriangleRightBottom, CellValue.TriangleLeftBottom],
			[CellValue.TriangleRightBottom, CellValue.Full, CellValue.Empty]
		];

		super(shape, "#3db056");
	}
}
