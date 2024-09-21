import type { Block } from "@/game/blocks/block";

export enum GamePadKey {}

export type Position = [number, number];

export type Shape = CellValue[][];

export type Square = {
	size: number;
	bottom_right: [number, number];
};

export enum GameStatus {
	//	游戏未开始
	NotStart,
	//	可操作的方块正在下落
	Active,
	//	消除方块后，正在悬空的格子
	MoveBoard,
	//	游戏失败
	Fail
}

export type CellValue = {
	origin: CellOriginValue
}

export enum CellOriginValue {
	Empty,
	TriangleLeftTop,
	TriangleLeftBottom,
	TriangleRightTop,
	TriangleRightBottom,
	Full
}

// todo board cell value should not be empty
export type BoardCellValue = CellValue;

export type BoardCell = {
	value: BoardCellValue;
	block: Block;
}[];

export type Board = BoardCell[][];

export const RotateTable = {
	[CellOriginValue.Empty]: CellOriginValue.Empty,
	[CellOriginValue.TriangleLeftTop]: CellOriginValue.TriangleRightTop,
	[CellOriginValue.TriangleLeftBottom]: CellOriginValue.TriangleLeftTop,
	[CellOriginValue.TriangleRightTop]: CellOriginValue.TriangleRightBottom,
	[CellOriginValue.TriangleRightBottom]: CellOriginValue.TriangleLeftBottom,
	[CellOriginValue.Full]: CellOriginValue.Full
};

export const FlipTable = {
	[CellOriginValue.Empty]: CellOriginValue.Empty,
	[CellOriginValue.TriangleLeftTop]: CellOriginValue.TriangleRightTop,
	[CellOriginValue.TriangleLeftBottom]: CellOriginValue.TriangleRightBottom,
	[CellOriginValue.TriangleRightTop]: CellOriginValue.TriangleLeftTop,
	[CellOriginValue.TriangleRightBottom]: CellOriginValue.TriangleLeftBottom,
	[CellOriginValue.Full]: CellOriginValue.Full
};

export enum MoveDirection {
	Left,
	Right,
	Down
}
