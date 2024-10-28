import type { Block } from "@/game/blocks/block";
import { type Board, CellValue, GameStatus, MoveDirection, type Square } from "@/game/types";
import { Renderer } from "@/game/renderer/renderer";
import { CanvasRenderer } from "@/game/renderer/canvas/canvas_renderer";
import { boardEraseBlock, calculateScore, copyBoard, findMaxValidSquare, getRandomShape, isPositionEqual } from "@/utils/utils";
import { STAND_BY_COUNT } from "@/game/config";
import { Shape1 } from "@/game/blocks/shape-1";
import { Shape5 } from "@/game/blocks/shape-5";

interface GameOptions {
	game_container: HTMLElement;
	next_container: HTMLElement;
	columns: number;
	rows: number;
	board_cell_size: number;
	onFail: () => void;
	onScore: (score: number) => void;
}

export class Game {
	private loop_timer: number | null = null;
	private active_block: Block | null = null;
	private block_queue: Block[] = [];
	private readonly boards: Board = [];
	private renderer: Renderer;
	private state: GameStatus = GameStatus.NotStart;
	private cleared_squares: Square | null = null;
	private dead_blocks: Block[] = [];
	private options: GameOptions;

	constructor(options: GameOptions) {
		this.renderer = new CanvasRenderer(options.game_container, options.next_container, {
			board_cell_size: options.board_cell_size,
			columns: options.columns,
			rows: options.rows
		});
		this.boards = Array(options.rows)
			.fill(0)
			.map(() => new Array(options.columns).fill(0).map(() => []));
		this.options = options;
		// for (let i = 0; i < STAND_BY_COUNT + 1; i++) {
		// 	this.block_queue.push(new (getRandomShape())());
		// }
		this.block_queue.push(new Shape5());
		this.block_queue.push(new Shape1());
		this.block_queue.push(new Shape1());
	}

	start() {
		this.bindEvents();
		this.state = GameStatus.Active;
		this.loop();
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
		this.loop();
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
			case GameStatus.ClearAnimation:
				break;
			case GameStatus.MoveBoard:
				this.loopWhenMoveBoard();
				break;
			case GameStatus.Fail:
				console.log("game over");
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
		console.log("collide: ", this.active_block.isCollide(this.boards));

		if (this.active_block.isCollide(this.boards)) {
			const position = this.active_block.getPosition();
			if (isPositionEqual(position, [0, 0])) {
				this.options.onFail();
				this.state = GameStatus.Fail;
			} else {
				this.active_block.moveUp();
				this.updateBoardsFromActiveBlock();
				this.dead_blocks.push(this.active_block);
				console.log("dead_blocks: ", this.dead_blocks);
				this.active_block = null;
				const max_square = findMaxValidSquare(this.boards);

				if (max_square) {
					this.onSquareFind(max_square);
				}
			}
		}
		this.draw();
		this.loop_timer = window.setTimeout(() => this.loop(), 1000);
	}

	private loopWhenMoveBoard() {
		const is_board_changed = this.moveDeadBlocksFall();

		this.draw();
		if (!is_board_changed) {
			const max_square = findMaxValidSquare(this.boards);
			if (max_square) {
				this.onSquareFind(max_square);
			} else {
				this.state = GameStatus.Active;
			}
		}
		this.loop_timer = window.setTimeout(() => this.loop(), 1000);
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

	private onSquareFind(square: Square) {
		console.log("max_square: ", square);
		const score = calculateScore(square, this.boards);
		console.log("score: ", score);
		this.options.onScore(score);
		const need_clear_blocks = this.getAllBlocksFromSquare(square);
		this.clearBoardFromSquare(square);
		this.clearBoardFromBlocks(need_clear_blocks);
		this.dead_blocks = this.dead_blocks.filter((block) => !need_clear_blocks.has(block));

		this.renderer.renderBlockEffect(need_clear_blocks, this.boards).then(() => {
			console.log("finish animation end");
			this.renderer.renderSpreadLight(this.boards, square).then(() => {

				const other_clear_blocks = this.findBlocksInSpreadLight(square);

				this.clearBoardFromBlocks(other_clear_blocks);

				this.dead_blocks = this.dead_blocks.filter((block) => !other_clear_blocks.has(block));

				this.renderer.renderBlockEffect(other_clear_blocks, this.boards).then(() => {
					this.state = GameStatus.MoveBoard;
					this.loop();
				})
			});
		});
		this.cleared_squares = square;
		this.state = GameStatus.ClearAnimation;
		console.log("finish animation start");
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
			switch (e.key) {
				case "ArrowUp":
					this.active_block?.rotateIfNotCollide(this.boards);
					break;
				case "ArrowDown":
					this.active_block?.moveIfNotCollide(MoveDirection.Down, this.boards);
					break;
				case "ArrowLeft":
					this.active_block?.moveIfNotCollide(MoveDirection.Left, this.boards);
					break;
				case "ArrowRight":
					this.active_block?.moveIfNotCollide(MoveDirection.Right, this.boards);
					break;
				case " ":
					this.active_block?.flipIfNotCollide(this.boards);
					break;
			}
			this.draw();
		});
	}

	private bindGamepadEvents() {}

	private getAllBlocksFromSquare(square: Square) {
		const {
			size,
			bottom_right: [bottom, right]
		} = square;
		const need_clear_blocks: Set<Block> = new Set();

		for (let i = bottom - size + 1; i <= bottom; i++) {
			for (let j = right - size + 1; j <= right; j++) {
				this.boards[i][j].forEach((cell) => {
					need_clear_blocks.add(cell.block);
				});
			}
		}
		return need_clear_blocks;
	}

	private clearBoardFromSquare(square: Square) {
		const {
			size,
			bottom_right: [bottom, right]
		} = square;

		for (let i = bottom - size + 1; i <= bottom; i++) {
			for (let j = right - size + 1; j <= right; j++) {
				this.boards[i][j].length = 0;
			}
		}
	}

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

	private findBlocksInSpreadLight(square: Square) {
		const {
			size,
			bottom_right: [bottom, right]
		} = square;
		const result: Set<Block> = new Set();

		for (let y = 0; y < this.boards.length; y++) {
			for (let x = right- size + 1; x <= right; x++) {
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
