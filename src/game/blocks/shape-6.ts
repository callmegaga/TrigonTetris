import { Block } from "./block";
import { CellValue, type Shape } from "@/game/types";

const shape: Shape = [
	[CellValue.Empty, CellValue.TriangleRightBottom, CellValue.TriangleLeftBottom, CellValue.Empty],
	[CellValue.TriangleRightBottom, CellValue.Full, CellValue.Empty, CellValue.Empty]
];

export class Shape6 extends Block {
	constructor() {
		super(shape, "#3db056");
	}
}
