import { Block } from "./block";
import { CellValue, type Shape } from "@/game/types";

const shape: Shape = [
	[CellValue.Empty, CellValue.TriangleRightBottom, CellValue.TriangleLeftBottom],
	[CellValue.TriangleRightBottom, CellValue.Full, CellValue.Full]
];

export class Shape7 extends Block {
	constructor() {
		super(shape, "#f8bf2d");
	}
}
