import type { Block } from "@/game/blocks/block";
import { type Board, CellOriginValue, GameStatus, MoveDirection, type Square } from "@/game/types";
import { Renderer } from "@/game/renderer/renderer";
import { CanvasRenderer } from "@/game/renderer/canvas_renderer";
import { isCollideTwoBoardCell, isEmptyBoardCell, getRandomShape, calculateScore, findMaxValidSquare } from "@/utils/utils";

interface GameOptions {
	container: HTMLElement;
	columns: number;
	rows: number;
	block_size: number;
}

export class Game {
	private loop_timer: number | null = null;
	private active_block: Block | null = null;
	private readonly boards: Board = [];
	private renderer: Renderer;
	private state: GameStatus = GameStatus.NotStart;
	private cleared_squares: Square | null = null;
	private dead_blocks: Block[] = [];

	constructor(options: GameOptions) {
		this.renderer = new CanvasRenderer(options.container, {
			block_size: options.block_size,
			columns: options.columns,
			rows: options.rows
		});
		this.boards = Array(options.rows)
			.fill(0)
			.map(() => new Array(options.columns).fill(0).map(() => []));
	}

	start() {
		this.bindEvents();
		this.active_block = new (getRandomShape())();
		this.state = GameStatus.Active;
		this.loop();
	}

	end() {
		this.unbindEvents();
		if (this.loop_timer) window.clearTimeout(this.loop_timer);
	}

	private loop() {
		switch (this.state) {
			case GameStatus.NotStart:
				break;
			case GameStatus.Active:
				this.loopWhenActive();
				break;
			case GameStatus.MoveBoard:
				this.loopWhenMoveBoard();
				break;
			case GameStatus.Fail:
				break;
		}
	}

	private loopWhenActive() {
		if (!this.active_block) {
			this.active_block = new (getRandomShape())();
		}
		this.active_block?.move(MoveDirection.Down);
		console.log("collide: ", this.active_block.isCollide(this.boards));

		if (this.active_block.isCollide(this.boards)) {
			this.active_block.moveUp();
			this.updateBoardsFromActiveBlock();
			this.dead_blocks.push(this.active_block);
			this.active_block = null;
			const max_square = findMaxValidSquare(this.boards);

			if (max_square) {
				console.log("max_square: ", max_square);
				const score = calculateScore(max_square, this.boards);
				console.log("score: ", score);

				this.clearSquare(max_square);
				this.cleared_squares = max_square;
				this.state = GameStatus.MoveBoard;
			}
		}
		this.draw();
		this.loop_timer = window.setTimeout(() => this.loop(), 1000);
	}

	private loopWhenMoveBoard() {
		let is_board_changed = false;
		const width = this.boards[0].length;
		const height = this.boards.length;

		for (let i = height - 2; i >= 0; i--) {
			for (let j = 0; j < width; j++) {
				if (!isEmptyBoardCell(this.boards[i][j]) && !isCollideTwoBoardCell(this.boards[i][j], this.boards[i + 1][j])) {
					this.boards[i + 1][j] = this.boards[i + 1][j].concat(this.boards[i][j]);
					this.boards[i][j] = [];
					is_board_changed = true;
				}
			}
		}
		this.draw();
		if (!is_board_changed) {
			this.state = GameStatus.Active;
		}
		this.loop_timer = window.setTimeout(() => this.loop(), 1000);
	}

	private draw() {
		this.renderer.render(this.boards, this.active_block);
	}

	private updateBoardsFromActiveBlock() {
		if (!this.active_block) return;
		const shape = this.active_block.getShape();
		const block_position = this.active_block.getPosition();

		shape.forEach((row, y) => {
			row.forEach((cell, x) => {
				if (cell.origin === CellOriginValue.Empty) return;
				this.boards[y + block_position[1]][x + block_position[0]].push({
					value: cell,
					block: this.active_block as Block
				});
			});
		});
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

	private clearSquare(square: Square) {
		const {
			size,
			bottom_right: [bottom, right]
		} = square;
		for (let i = bottom - size + 1; i <= bottom; i++) {
			for (let j = right - size + 1; j <= right; j++) {
				this.boards[i][j] = [];
			}
		}
	}
}
