import { GameStatus, type BoardCellValue, type Position, type Shape } from "@/game/types";

export type FeedbackStatus = "new" | "processing" | "resolved";

export type SnapshotFragment = {
	value: BoardCellValue;
	color: string;
};

export type SnapshotCell = SnapshotFragment[];

export type SnapshotBlock = {
	shape: Shape;
	position: Position;
	color: string;
};

export type GameStatusKey = "NotStart" | "Active" | "MoveBoard" | "ExtendLife" | "Fail";

export type GameSnapshot = {
	version: 1;
	score: number;
	maxScore: number;
	gameStatus: GameStatusKey;
	board: SnapshotCell[][];
	activeBlock: SnapshotBlock | null;
	nextBlocks: SnapshotBlock[];
	submittedAt: string;
	viewport: {
		width: number;
		height: number;
	};
};

export type FeedbackReport = {
	id: string;
	status: FeedbackStatus;
	description: string;
	screenshotPath: string | null;
	snapshot: GameSnapshot;
	createdAt: string;
	meta: {
		userAgent: string;
		pathname: string;
		referrer: string;
	};
};

const GAME_STATUS_KEY_TABLE: Record<GameStatus, GameStatusKey> = {
	[GameStatus.NotStart]: "NotStart",
	[GameStatus.Active]: "Active",
	[GameStatus.MoveBoard]: "MoveBoard",
	[GameStatus.ExtendLife]: "ExtendLife",
	[GameStatus.Fail]: "Fail"
};

const GAME_STATUS_VALUE_TABLE: Record<GameStatusKey, GameStatus> = {
	NotStart: GameStatus.NotStart,
	Active: GameStatus.Active,
	MoveBoard: GameStatus.MoveBoard,
	ExtendLife: GameStatus.ExtendLife,
	Fail: GameStatus.Fail
};

export function gameStatusToKey(status: GameStatus): GameStatusKey {
	return GAME_STATUS_KEY_TABLE[status];
}

export function gameStatusFromKey(status: GameStatusKey): GameStatus {
	return GAME_STATUS_VALUE_TABLE[status];
}

export function cloneShape(shape: Shape): Shape {
	return shape.map((row) => [...row]);
}

export function clonePosition(position: Position): Position {
	return [position[0], position[1]];
}
