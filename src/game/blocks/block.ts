import { type Board, CellValue, type Color, FlipTable, MoveDirection, type Position, RotateTable, type Shape, type NormalSquare } from "@/game/types";
import { buildShape, isCollideShapeAndBoardCell, isEmptyBoardCell } from "@/utils/utils";

export abstract class Block {
	protected shape: Shape;
	private readonly color: Color;
	protected current_position: Position = [0, 0];

	protected constructor(shape: Shape, color: string) {
		this.shape = shape;
		this.color = color;
		this.current_position[0] = Math.floor(Math.random() * 7);
	}

	moveUp() {
		this.current_position[1]--;
	}

	getShape(): Shape {
		return this.shape;
	}

	getColor(): string {
		return this.color;
	}

	getPosition(): Position {
		return this.current_position;
	}

	get width(): number {
		return this.shape[0].length;
	}

	get height(): number {
		return this.shape.length;
	}

	isCollide(boards: Board): boolean {
		const board_width = boards[0].length;
		const board_height = boards.length;

		if (this.current_position[0] < 0) return true;
		if (this.current_position[0] + this.width > board_width) return true;
		if (this.current_position[1] + this.height > board_height) return true;

		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				if (y + this.current_position[1] < 0) continue;
				const board_cell = boards[y + this.current_position[1]][x + this.current_position[0]];
				if (this.shape[y][x] === CellValue.Empty) continue;
				if (isEmptyBoardCell(board_cell)) continue;
				if (isCollideShapeAndBoardCell(this.shape[y][x], board_cell, this)) return true;
			}
		}
		return false;
	}

	copyShape(): Shape {
		const width = this.width;
		const height = this.height;
		const result = buildShape(width, height);
		for (let row = 0; row < height; row++) {
			for (let col = 0; col < width; col++) {
				result[row][col] = this.shape[row][col];
			}
		}
		return result;
	}

	move(direction: MoveDirection): void {
		switch (direction) {
			case MoveDirection.Left:
				this.current_position[0]--;
				break;
			case MoveDirection.Right:
				this.current_position[0]++;
				break;
			case MoveDirection.Down:
				this.current_position[1]++;
				break;
		}
	}

	moveIfNotCollide(boards: Board, direction: MoveDirection): boolean {
		this.move(direction);
		if (this.isCollide(boards)) {
			switch (direction) {
				case MoveDirection.Left:
					this.current_position[0]++;
					return false;
				case MoveDirection.Right:
					this.current_position[0]--;
					return false;
				case MoveDirection.Down:
					this.current_position[1]--;
					return false;
			}
		}
		return true;
	}

	rotateIfNotCollide(boards: Board): boolean {
		console.log("rotate");
		const width = this.width;
		const height = this.height;
		const old_shape = this.copyShape();
		const new_shape: Shape = buildShape(height, width);

		for (let row = 0; row < height; row++) {
			for (let col = 0; col < width; col++) {
				new_shape[col][height - 1 - row] = RotateTable[this.shape[row][col]];
			}
		}

		this.shape = new_shape;

		if (this.isCollide(boards)) {
			this.shape = old_shape;
			return false;
		}
		return true
	}

	flipIfNotCollide(boards: Board): boolean {
		const old_shape = this.copyShape();

		this.shape.forEach((row, y) => {
			this.shape[y] = row.reverse().map((cell) => {
				return FlipTable[cell];
			});
		});

		if (this.isCollide(boards)) {
			this.shape = old_shape;
			return false;
		}
		return true;
	}

	setPosition(position: Position): void {
		this.current_position = position;
	}

	jump(boards: Board): boolean {
		console.log("jump");
		const y = this.current_position[1];
		const board_height = boards.length;
		for (let new_y = board_height - 1; new_y > y; new_y--) {
			this.current_position[1] = new_y;
			if (this.isCollide(boards)) {
				this.current_position[1] = new_y - 1;
			} else {
				this.current_position[1] = new_y;
				return true;
			}
		}
		this.current_position[1] = y;
		return false
	}

	isInSquare(square: NormalSquare): boolean {
		const [position_x, position_y] = this.current_position;
		const {
			size,
			bottom_right: [bottom, right]
		} = square;
		const top = bottom - size + 1;
		const left = right - size + 1;

		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				if (this.shape[y][x] === CellValue.Empty) continue;
				if (position_x + x < left || position_x + x > right) return false;
				if (position_y + y < top || position_y + y > bottom) return false;
			}
		}
		return true;
	}
}
