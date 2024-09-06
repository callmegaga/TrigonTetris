import { Block } from "./block";
import { CellValue, type Shape } from "@/game/types";

const shape: Shape = [
	[CellValue.Full, CellValue.Full, CellValue.Full, CellValue.Full],
	[CellValue.Full, CellValue.Full, CellValue.Full, CellValue.Full],
	[CellValue.Full, CellValue.Full, CellValue.TriangleRightTop, CellValue.Full],
	[CellValue.Full, CellValue.Full, CellValue.Empty, CellValue.TriangleRightTop]
];

export class Shape5 extends Block {
	constructor() {
		super(shape, "#f799fc");
	}
}
