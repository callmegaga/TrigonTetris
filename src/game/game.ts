import type { Block } from "@/game/blocks/block";
import { type BevelledSquare, type Board, CellValue, GameStatus, MoveDirection, type NormalSquare, SquareType } from "@/game/types";
import { Renderer } from "@/game/renderer/renderer";
import { CanvasRenderer } from "@/game/renderer/canvas/canvas_renderer";
import { boardEraseBlock, calculateSquareScore, findMaxValidBevelledSquare, findMaxValidSquare, getBevelledSquareMaxSquare, getRandomShape, getSquareColorsAndBlocks, isBoardFirstNLineEmpty } from "@/utils/utils";
import { ACTIVE_BOARD_ROWS, GAME_INTERVAL_TIME, GAME_MOVE_BOARD_MULTIPLIER, STAND_BY_COUNT } from "@/game/config";
import { Shape1 } from "@/game/blocks/shape-1";
import { Shape5 } from "@/game/blocks/shape-5";
import { Shape2 } from "@/game/blocks/shape-2";

interface GameOptions {
	game_container: HTMLElement;
	next_container: HTMLElement;
	columns: number;
	rows: number;
	board_cell_size: number;
	onFail: () => void;
	onScore: (score: number, square: NormalSquare | BevelledSquare) => void;
}

export class Game {
	private loop_timer: number | null = null;
	private active_block: Block | null = null;
	private block_queue: Block[] = [];
	private readonly boards: Board = [];
	private renderer: Renderer;
	private state: GameStatus = GameStatus.NotStart;
	private dead_blocks: Block[] = [];
	private options: GameOptions;

	constructor(options: GameOptions) {
		this.renderer = new CanvasRenderer(options.game_container, options.next_container, {
			board_cell_size: options.board_cell_size,
			columns: options.columns,
			rows: options.rows,
			active_board_rows: ACTIVE_BOARD_ROWS
		});
		this.boards = Array(options.rows + ACTIVE_BOARD_ROWS)
			.fill(0)
			.map(() => new Array(options.columns).fill(0).map(() => []));
		this.options = options;
		// for (let i = 0; i < STAND_BY_COUNT + 1; i++) {
		// 	this.block_queue.push(new (getRandomShape())());
		// }
		this.block_queue.push(new Shape5());
		// this.block_queue.push(new Shape1());
		// this.block_queue.push(new Shape1());
		this.block_queue.push(new Shape1());
		this.block_queue.push(new Shape2());
		this.block_queue.push(new Shape2());
	}

	start() {
		this.bindEvents();
		this.state = GameStatus.Active;
		this.loop_timer = window.setTimeout(() => this.loop(), 0);
	}

	restart() {
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
		this.loop_timer = window.setTimeout(() => this.loop(), 0);
	}

	end() {
		this.unbindEvents();
		if (this.loop_timer) window.clearTimeout(this.loop_timer);
	}

	private loop() {
		console.log("game loop: ", this.state);
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
			console.log("new block");

			this.active_block = this.block_queue.shift() as Block;
			this.block_queue.push(new (getRandomShape())());
			this.drawNextBlock();
		} else {
			this.active_block?.move(MoveDirection.Down);
		}

		if (this.active_block.isCollide(this.boards)) {
			console.log("collide the boards");

			this.active_block.moveUp();
			const position = this.active_block.getPosition();
			console.log("the active block position", position);

			this.updateBoardsFromActiveBlock();
			this.dead_blocks.push(this.active_block);
			console.log("dead_blocks: ", this.dead_blocks);
			this.active_block = null;

			if (position[1] <= ACTIVE_BOARD_ROWS - 1) {
				this.state = GameStatus.ExtendLife;
				this.loop_timer = window.setTimeout(() => this.loop(), 0);
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

		this.draw();
		this.loop_timer = window.setTimeout(() => this.loop(), GAME_INTERVAL_TIME);
	}

	private loopWhenMoveBoard() {
		const is_board_changed = this.moveDeadBlocksFall();

		console.log("is_board_changed: ", is_board_changed);
		this.draw();
		if (!is_board_changed) {
			const max_square = findMaxValidSquare(this.boards, true);
			if (max_square) {
				this.onPerfectSquareFind(max_square);
			} else {
				if (this.canExitExtendLife()) {
					this.state = GameStatus.Active;
				} else {
					this.state = GameStatus.ExtendLife;
				}
			}
		}
		this.loop_timer = window.setTimeout(() => this.loop(), GAME_INTERVAL_TIME / GAME_MOVE_BOARD_MULTIPLIER);
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
		console.log("boards: ", this.boards);
		let is_board_changed = false;
		const dead_block_move_map = new Map<Block, boolean>();

		this.dead_blocks.forEach((block) => {
			dead_block_move_map.set(block, false);
		});
		let need_move_block_count = dead_block_move_map.size;
		console.log("dead_block:", this.dead_blocks);

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
	}

	private onCoverSquareFind(square: NormalSquare | BevelledSquare) {
		console.log("find cover square: ", square);
		const score = calculateSquareScore(this.boards, square, false);
		console.log("score: ", score);
		this.options.onScore(score, square);

		const { blocks: need_clear_blocks } = getSquareColorsAndBlocks(this.boards, square);

		this.clearBoardFromBlocks(need_clear_blocks);
		this.dead_blocks = this.dead_blocks.filter((block) => !need_clear_blocks.has(block));

		this.renderer.renderSquare(this.boards, square).then(() => {
			this.renderer.renderBlockEffect(this.boards, need_clear_blocks).then(() => {
				console.log("finish animation end");
				this.state = GameStatus.MoveBoard;
				this.loop_timer = window.setTimeout(() => this.loop(), 0);
			});
		});
	}

	private onPerfectSquareFind(square: NormalSquare | BevelledSquare) {
		console.log("find perfect square: ", square);
		const score = calculateSquareScore(this.boards, square, true);
		console.log("score: ", score);
		this.options.onScore(score, square);

		const { blocks: need_clear_blocks } = getSquareColorsAndBlocks(this.boards, square);

		this.clearBoardFromBlocks(need_clear_blocks);
		this.dead_blocks = this.dead_blocks.filter((block) => !need_clear_blocks.has(block));

		this.renderer.renderBlockEffect(this.boards, need_clear_blocks).then(() => {
			console.log("finish animation end");
			this.renderer.renderSpreadLight(this.boards, square).then(() => {
				const other_clear_blocks = this.findBlocksInSpreadLight(square);

				this.clearBoardFromBlocks(other_clear_blocks);

				this.dead_blocks = this.dead_blocks.filter((block) => !other_clear_blocks.has(block));

				this.renderer.renderBlockEffect(this.boards, other_clear_blocks).then(() => {
					this.state = GameStatus.MoveBoard;
					this.loop_timer = window.setTimeout(() => this.loop(), 0);
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
		this.renderer.renderNextBlock([this.block_queue[0], this.block_queue[1]]);
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
		this.bindKeyboardEvents();
		this.bindGamepadEvents();
	}

	private unbindEvents() {}

	private bindKeyboardEvents() {
		document.addEventListener("keydown", (e) => {
			if (this.state !== GameStatus.Active) return;
			switch (e.key) {
				case "ArrowUp":
					this.active_block?.rotateIfNotCollide(this.boards);
					break;
				case "ArrowDown":
					this.active_block?.moveIfNotCollide(this.boards, MoveDirection.Down);
					break;
				case "ArrowLeft":
					this.active_block?.moveIfNotCollide(this.boards, MoveDirection.Left);
					break;
				case "ArrowRight":
					this.active_block?.moveIfNotCollide(this.boards, MoveDirection.Right);
					break;
				case " ":
					this.active_block?.flipIfNotCollide(this.boards);
					break;
				case "Enter":
					this.active_block?.jump(this.boards);
					break;
			}
			this.draw();
		});
	}

	private bindGamepadEvents() {}

	private clearBoardFromBlocks(blocks: Set<Block>) {
		blocks.forEach((block) => {
			const position = block.getPosition();
			const shape = block.getShape();
			shape.forEach((row, y) => {
				row.forEach((cell, x) => {
					if (cell === CellValue.Empty) return;
					this.boards[y + position[1]][x + position[0]].length = 0;
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
}
