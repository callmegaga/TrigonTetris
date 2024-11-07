import type { Block } from "@/game/blocks/block";

export enum GamePadKey {}

export type Position = [number, number];

export type Shape = CellValue[][];

export type Color = string;

export enum SquareType {
	// 水平和垂直构成的正方形
	normal,
	// 斜正方形
	bevelled
}

export type NormalSquare = {
	type: SquareType.normal;
	size: number;
	bottom_right: [number, number];
};

export type BevelledSquare = {
	type: SquareType.bevelled;
	size: number;
	top_left: [number, number];
};

export type Rectangle = [number, number, number, number];

export enum GameStatus {
	//	游戏未开始
	NotStart,
	//	可操作的方块正在下落
	Active,
	//	消除方块后，正在悬空的格子
	MoveBoard,
	//	续命
	ExtendLife,
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

// export type BoardCellValue = Omit<CellValue, CellValue.Empty>;
export type BoardCellValue = CellValue.TriangleLeftTop | CellValue.TriangleLeftBottom | CellValue.TriangleRightTop | CellValue.TriangleRightBottom | CellValue.Full;

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
