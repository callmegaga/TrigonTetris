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

export type SnapshotRect = {
	x: number;
	y: number;
	width: number;
	height: number;
	top: number;
	right: number;
	bottom: number;
	left: number;
};

export type ClientEnvironment = {
	userAgent: string;
	language: string;
	languages: string[];
	platform: string;
	vendor: string;
	cookieEnabled: boolean;
	onLine: boolean;
	devicePixelRatio: number;
	window: {
		innerWidth: number;
		innerHeight: number;
		outerWidth: number;
		outerHeight: number;
		scrollX: number;
		scrollY: number;
	};
	screen: {
		width: number;
		height: number;
		availWidth: number;
		availHeight: number;
		colorDepth: number;
		pixelDepth: number;
		orientationType: string;
		orientationAngle: number;
	};
	visualViewport: {
		width: number;
		height: number;
		scale: number;
		offsetLeft: number;
		offsetTop: number;
		pageLeft: number;
		pageTop: number;
	} | null;
	document: {
		clientWidth: number;
		clientHeight: number;
		scrollWidth: number;
		scrollHeight: number;
	};
	layout: {
		cellSize: number;
		boardColumns: number;
		boardRows: number;
		boardPixelWidth: number;
		boardPixelHeight: number;
		body: SnapshotRect;
		main: SnapshotRect | null;
		boardPanel: SnapshotRect | null;
		game: SnapshotRect | null;
		gameCanvas: SnapshotRect | null;
		leftPanel: SnapshotRect | null;
		samplePanel: SnapshotRect | null;
		sample: SnapshotRect | null;
		next: SnapshotRect | null;
		samplesVisible: number;
		sampleIntroVisible: boolean;
	};
};

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
	environment?: ClientEnvironment;
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
