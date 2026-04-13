import type { Block } from "@/game/blocks/block";
import { type BevelledSquare, type Board, CellValue, GameStatus, MoveDirection, type NormalSquare, SquareType } from "@/game/types";
import { Renderer } from "@/game/renderer/renderer";
import { CanvasRenderer } from "@/game/renderer/canvas/renderer";
import { NextRenderer } from "@/game/renderer/canvas/next_renderer";
import { boardEraseBlock, calculateSquareScore, findMaxValidBevelledSquare, findMaxValidSquare, getBevelledSquareMaxSquare, getRandomShape, getSquareColorsAndBlocks, isBoardFirstNLineEmpty } from "@/utils/utils";
import { ACTIVE_BOARD_ROWS, GAME_INTERVAL_TIME, GAME_MOVE_BOARD_MULTIPLIER, STAND_BY_COUNT } from "@/game/config";
import { clonePosition, cloneShape, gameStatusToKey, type GameSnapshot, type SnapshotBlock as SnapshotBlockData, type SnapshotCell } from "@/feedback/types";

export enum ScoreType {
	Perfect,
	Cover
}

interface GameOptions {
	game_container: HTMLElement;
	next_container: HTMLElement;
	columns: number;
	rows: number;
	board_cell_size: number;
	onFail: () => void;
	onScore: (score: number, square: NormalSquare | BevelledSquare, type: ScoreType) => void;
	onJump: () => void;
	onRotate: () => void;
	onMove: () => void;
	onFlip: () => void;
}

export class Game {
	private loop_timer: number | undefined = undefined;
	private active_block: Block | null = null;
	private block_queue: Block[] = [];
	private readonly boards: Board = [];
	private renderer: Renderer;
	private next_renderer: NextRenderer;
	private state: GameStatus = GameStatus.NotStart;
	private dead_blocks: Block[] = [];
	private options: GameOptions;
	private is_paused = false;
	private events_bound = false;
	private readonly keyboard_handler = (e: KeyboardEvent) => {
		if (this.state !== GameStatus.Active || this.is_paused) return;
		switch (e.key) {
			case "ArrowUp":
				if (this.active_block?.rotateIfNotCollide(this.boards)) {
					this.options.onRotate();
				}
				break;
			case "ArrowDown":
				if (this.active_block?.jump(this.boards)) {
					this.options.onJump();
				}
				break;
			case "ArrowLeft":
				if (this.active_block?.moveIfNotCollide(this.boards, MoveDirection.Left)) {
					this.options.onMove();
				}
				break;
			case "ArrowRight":
				if (this.active_block?.moveIfNotCollide(this.boards, MoveDirection.Right)) {
					this.options.onMove();
				}
				break;
			case " ":
				if (this.active_block?.flipIfNotCollide(this.boards)) {
					this.options.onFlip();
				}
				break;
		}
		this.draw();
	};

	constructor(options: GameOptions) {
		this.renderer = new CanvasRenderer(options.game_container, {
			board_cell_size: options.board_cell_size,
			columns: options.columns,
			rows: options.rows,
			active_board_rows: ACTIVE_BOARD_ROWS
		});

		this.next_renderer = new NextRenderer(options.next_container, options.board_cell_size * 0.8);
		this.boards = Array(options.rows + ACTIVE_BOARD_ROWS)
			.fill(0)
			.map(() => new Array(options.columns).fill(0).map(() => []));
		this.options = options;
		for (let i = 0; i < STAND_BY_COUNT + 1; i++) {
			this.block_queue.push(new (getRandomShape())());
		}
		this.renderer.render(this.boards, this.active_block);
		this.next_renderer.render([this.block_queue[0], this.block_queue[1]]);
	}

	start() {
		this.is_paused = false;
		this.bindEvents();
		this.state = GameStatus.Active;
		this.scheduleLoop(0);
	}

	restart() {
		if (this.loop_timer) {
			window.clearTimeout(this.loop_timer);
		}
		this.boards.forEach((row) => {
			row.forEach((cell) => {
				cell.length = 0;
			});
		});
		this.active_block = null;
		this.block_queue = [];
		for (let i = 0; i < STAND_BY_COUNT + 1; i++) {
			this.block_queue.push(new (getRandomShape())());
		}
		this.state = GameStatus.Active;
		this.is_paused = false;
		this.bindEvents();
		this.scheduleLoop(0);
	}

	stop() {
		if (this.loop_timer) {
			window.clearTimeout(this.loop_timer);
		}
	}

	pause() {
		if (this.is_paused) return;
		this.is_paused = true;
		if (this.loop_timer) {
			window.clearTimeout(this.loop_timer);
			this.loop_timer = undefined;
		}
		this.unbindEvents();
	}

	resume() {
		if (!this.is_paused) return;
		this.is_paused = false;
		if (this.state === GameStatus.Active || this.state === GameStatus.MoveBoard || this.state === GameStatus.ExtendLife) {
			this.bindEvents();
			this.scheduleLoop(0);
		}
	}

	getSnapshot(score: number, maxScore: number): GameSnapshot {
		return {
			version: 1,
			score,
			maxScore,
			gameStatus: gameStatusToKey(this.state),
			board: this.serializeBoard(),
			activeBlock: this.serializeBlock(this.active_block),
			nextBlocks: this.block_queue.slice(0, STAND_BY_COUNT).map((block) => this.serializeBlock(block) as SnapshotBlockData),
			submittedAt: new Date().toISOString(),
			viewport: {
				width: window.innerWidth,
				height: window.innerHeight
			}
		};
	}

	end() {
		this.unbindEvents();
		this.is_paused = false;
		if (this.loop_timer) window.clearTimeout(this.loop_timer);
	}

	private loop() {
		if (this.is_paused) return;
		switch (this.state) {
			case GameStatus.NotStart:
				break;
			case GameStatus.Active:
				this.loopWhenActive();
				break;
			case GameStatus.MoveBoard:
				this.loopWhenMoveBoard();
				break;
			case GameStatus.ExtendLife:
				this.loopWhenExtendLife();
				break;
			case GameStatus.Fail:
				break;
		}
	}

	private loopWhenActive() {
		if (!this.active_block) {
			this.active_block = this.block_queue.shift() as Block;
			this.block_queue.push(new (getRandomShape())());
			this.drawNextBlock();
		} else {
			if (this.active_block?.canMove(this.boards, MoveDirection.Down)) {
				this.active_block?.move(MoveDirection.Down);
			} else {
				const position = this.active_block.getPosition();

				this.updateBoardsFromActiveBlock();
				this.dead_blocks.push(this.active_block);
				this.active_block = null;

				if (position[1] <= ACTIVE_BOARD_ROWS - 1) {
					this.state = GameStatus.ExtendLife;
					this.scheduleLoop(0);
					return;
				} else {
					const max_bevelled_square = findMaxValidBevelledSquare(this.boards, true);
					if (max_bevelled_square) {
						this.onPerfectSquareFind(max_bevelled_square);
						return;
					}

					const max_square = findMaxValidSquare(this.boards, true);
					if (max_square) {
						this.onPerfectSquareFind(max_square);
						return;
					}
				}
			}
		}

		this.draw();
		this.scheduleLoop(GAME_INTERVAL_TIME);
	}

	private loopWhenMoveBoard() {
		const is_board_changed = this.moveDeadBlocksFall();

		this.draw();
		if (!is_board_changed) {
			// 扩散清除和棋盘稳定之后，这个阶段只继续检查普通正方形，
			// 不会在 MoveBoard 阶段再次扫描 Perfect BevelledSquare。
			const max_square = findMaxValidSquare(this.boards, true);
			if (max_square) {
				this.onPerfectSquareFind(max_square);
				return;
			} else {
				if (this.canExitExtendLife()) {
					this.state = GameStatus.Active;
				} else {
					this.state = GameStatus.ExtendLife;
				}
			}
		}
		this.scheduleLoop(GAME_INTERVAL_TIME / GAME_MOVE_BOARD_MULTIPLIER);
	}

	private loopWhenExtendLife() {
		const max_bevelled_square = findMaxValidBevelledSquare(this.boards, false);
		if (max_bevelled_square) {
			this.onCoverSquareFind(max_bevelled_square);
			return;
		}

		const max_square = findMaxValidSquare(this.boards, false);
		if (max_square) {
			this.onCoverSquareFind(max_square);
			return;
		}

		this.state = GameStatus.Fail; // game over
		this.options.onFail();
	}

	private moveDeadBlocksFall() {
		let is_board_changed = false;
		const dead_block_move_map = new Map<Block, boolean>();

		this.dead_blocks.forEach((block) => {
			dead_block_move_map.set(block, false);
		});
		let need_move_block_count = dead_block_move_map.size;

		for (let y = this.boards.length - 2; y >= 0; y--) {
			for (let x = 0; x < this.boards[y].length; x++) {
				const cell = this.boards[y][x];
				if (cell.length === 0) {
					continue;
				}
				cell.forEach((block_cell) => {
					const block = block_cell.block;
					if (dead_block_move_map.get(block)) {
						return;
					}
					dead_block_move_map.set(block, true);
					need_move_block_count--;

					boardEraseBlock(this.boards, block);

					block.move(MoveDirection.Down);

					if (block.isCollide(this.boards)) {
						block.moveUp();
					} else {
						is_board_changed = true;
					}
					this.updateBoardsFromBlock(block);
				});

				if (need_move_block_count === 0) {
					return is_board_changed;
				}
			}
		}
		return is_board_changed;
	}

	private onCoverSquareFind(square: NormalSquare | BevelledSquare) {
		const score = calculateSquareScore(this.boards, square, false);
		this.options.onScore(score, square, ScoreType.Cover);

		const { blocks: need_clear_blocks } = getSquareColorsAndBlocks(this.boards, square);

		this.clearBoardFromBlocks(need_clear_blocks);
		this.dead_blocks = this.dead_blocks.filter((block) => !need_clear_blocks.has(block));
		this.renderer.renderBlocks(need_clear_blocks, "red");
		this.renderer.renderSquare(this.boards, square, false).then(() => {
			this.renderer.renderBlockEffect(this.boards, need_clear_blocks).then(() => {
				this.state = GameStatus.MoveBoard;
				this.scheduleLoop(0);
			});
		});
	}

	private onPerfectSquareFind(square: NormalSquare | BevelledSquare) {
		const score = calculateSquareScore(this.boards, square, true);
		this.options.onScore(score, square, ScoreType.Perfect);

		const { blocks: need_clear_blocks } = getSquareColorsAndBlocks(this.boards, square);

		this.clearBoardFromBlocks(need_clear_blocks);
		this.dead_blocks = this.dead_blocks.filter((block) => !need_clear_blocks.has(block));

		this.renderer.renderBlockEffect(this.boards, need_clear_blocks).then(() => {
			this.renderer.renderSpreadLight(this.boards, square).then(() => {
				const other_clear_blocks = this.findBlocksInSpreadLight(square);

				this.clearBoardFromBlocks(other_clear_blocks);

				this.dead_blocks = this.dead_blocks.filter((block) => !other_clear_blocks.has(block));

				this.renderer.renderBlockEffect(this.boards, other_clear_blocks).then(() => {
					this.state = GameStatus.MoveBoard;
					this.scheduleLoop(0);
				});
			});
		});
	}

	private canExitExtendLife() {
		return isBoardFirstNLineEmpty(this.boards, ACTIVE_BOARD_ROWS);
	}

	private draw() {
		this.renderer.render(this.boards, this.active_block);
	}

	private drawNextBlock() {
		this.next_renderer.render([this.block_queue[0], this.block_queue[1]]);
	}

	private updateBoardsFromBlock(block: Block) {
		const shape = block.getShape();
		const block_position = block.getPosition();

		shape.forEach((row, y) => {
			row.forEach((cell, x) => {
				if (cell === CellValue.Empty) return;
				this.boards[y + block_position[1]][x + block_position[0]].push({
					value: cell,
					block: block
				});
			});
		});
	}

	private updateBoardsFromActiveBlock() {
		if (!this.active_block) return;
		this.updateBoardsFromBlock(this.active_block);
	}

	private bindEvents() {
		if (this.events_bound) return;
		this.bindKeyboardEvents();
		this.bindGamepadEvents();
		this.events_bound = true;
	}

	private unbindEvents() {
		if (!this.events_bound) return;
		document.removeEventListener("keydown", this.keyboard_handler);
		this.events_bound = false;
	}

	private bindKeyboardEvents() {
		document.addEventListener("keydown", this.keyboard_handler);
	}

	private bindGamepadEvents() {}

	private clearBoardFromBlocks(blocks: Set<Block>) {
		blocks.forEach((block) => {
			const position = block.getPosition();
			const shape = block.getShape();
			shape.forEach((row, y) => {
				row.forEach((cell, x) => {
					if (cell === CellValue.Empty) return;

					const board_cell = this.boards[y + position[1]][x + position[0]];
					this.boards[y + position[1]][x + position[0]] = board_cell.filter((block_cell) => block_cell.block !== block);
				});
			});
		});
	}

	private findBlocksInSpreadLight(square: NormalSquare | BevelledSquare) {
		if (square.type === SquareType.bevelled) {
			square = getBevelledSquareMaxSquare(square);
		}
		const {
			size,
			bottom_right: [bottom, right]
		} = square;
		const result: Set<Block> = new Set();

		for (let y = 0; y < this.boards.length; y++) {
			for (let x = right - size + 1; x <= right; x++) {
				const cell = this.boards[y][x];
				cell.forEach((block_cell) => {
					result.add(block_cell.block);
				});
			}
		}

		for (let x = 0; x < this.boards[0].length; x++) {
			for (let y = bottom - size + 1; y <= bottom; y++) {
				const cell = this.boards[y][x];
				cell.forEach((block_cell) => {
					result.add(block_cell.block);
				});
			}
		}
		return result;
	}

	private scheduleLoop(delay: number) {
		if (this.is_paused) return;
		this.loop_timer = window.setTimeout(() => this.loop(), delay);
	}

	private serializeBoard(): SnapshotCell[][] {
		return this.boards.map((row) =>
			row.map((cell) =>
				cell.map(({ value, block }) => ({
					value,
					color: block.getColor()
				}))
			)
		);
	}

	private serializeBlock(block: Block | null): SnapshotBlockData | null {
		if (!block) return null;
		return {
			shape: cloneShape(block.getShape()),
			position: clonePosition(block.getPosition()),
			color: block.getColor()
		};
	}
}
