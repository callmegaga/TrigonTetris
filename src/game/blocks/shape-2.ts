import { Block } from "./block";
import { CellValue, type Shape } from "@/game/types";

const shape: Shape = [
	[CellValue.TriangleLeftBottom, CellValue.Empty],
	[CellValue.Full, CellValue.TriangleLeftBottom]
];

export class Shape2 extends Block {
	constructor() {
		super(shape, "#a2d9e9");
	}
}
