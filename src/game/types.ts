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

export enum CellValue {
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
	[CellValue.Empty]: CellValue.Empty,
	[CellValue.TriangleLeftTop]: CellValue.TriangleRightTop,
	[CellValue.TriangleLeftBottom]: CellValue.TriangleLeftTop,
	[CellValue.TriangleRightTop]: CellValue.TriangleRightBottom,
	[CellValue.TriangleRightBottom]: CellValue.TriangleLeftBottom,
	[CellValue.Full]: CellValue.Full
};

export const FlipTable = {
	[CellValue.Empty]: CellValue.Empty,
	[CellValue.TriangleLeftTop]: CellValue.TriangleRightTop,
	[CellValue.TriangleLeftBottom]: CellValue.TriangleRightBottom,
	[CellValue.TriangleRightTop]: CellValue.TriangleLeftTop,
	[CellValue.TriangleRightBottom]: CellValue.TriangleLeftBottom,
	[CellValue.Full]: CellValue.Full
};

export enum MoveDirection {
	Left,
	Right,
	Down
}
