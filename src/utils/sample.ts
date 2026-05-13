import type { Block } from "@/game/blocks/block";
import { Shape1 } from "@/game/blocks/shape-1";
import { Shape2 } from "@/game/blocks/shape-2";
import { Shape3 } from "@/game/blocks/shape-3";
import { Shape4 } from "@/game/blocks/shape-4";
import { Shape5 } from "@/game/blocks/shape-5";
import { Shape6 } from "@/game/blocks/shape-6";
import { Shape7 } from "@/game/blocks/shape-7";
import type { Position } from "@/game/types";

type ShapeConstructor = new () => Block;

function createBlock(Shape: ShapeConstructor, position: Position, transforms = "") {
	const shape = new Shape();
	for (const transform of transforms) {
		if (transform === "r") shape.rotate();
		if (transform === "f") shape.flip();
	}
	shape.setPosition(position);
	return shape;
}

function sample640() {
	return {
		blocks: [createBlock(Shape1, [0, 0], "r"), createBlock(Shape1, [0, 0], "rr"), createBlock(Shape5, [2, 0], "rrr"), createBlock(Shape7, [0, 2])],
		score: 640
	};
}

function sample64() {
	return {
		blocks: [createBlock(Shape5, [0, 0], "r"), createBlock(Shape7, [1, 0], "rr"), createBlock(Shape7, [2, 0], "rf"), createBlock(Shape5, [0, 2], "f")],
		score: 64
	};
}

function sample800() {
	return {
		blocks: [createBlock(Shape1, [0, 0], "rr"), createBlock(Shape1, [2, 0], "rrr"), createBlock(Shape2, [0, 0]), createBlock(Shape2, [2, 2]), createBlock(Shape3, [0, 2])],
		score: 800
	};
}

function sample48() {
	return {
		blocks: [createBlock(Shape2, [0, 0], "rrr"), createBlock(Shape2, [0, 2], "rr"), createBlock(Shape1, [2, 0], "r")],
		score: 48
	};
}

function sample480() {
	return {
		blocks: [createBlock(Shape6, [1, 2], "rr"), createBlock(Shape2, [2, 0]), createBlock(Shape7, [0, 0], "rf")],
		score: 480
	};
}

function sample200000() {
	return {
		blocks: [createBlock(Shape1, [0, 0], "r"), createBlock(Shape1, [0, 0], "rr"), createBlock(Shape6, [3, 0], "rrr"), createBlock(Shape4, [4, 0]), createBlock(Shape1, [1, 1]), createBlock(Shape7, [0, 3], "f"), createBlock(Shape1, [1, 3], "rr"), createBlock(Shape2, [3, 3], "rrr")],
		score: 200000
	};
}

function sample2000000() {
	return {
		blocks: [createBlock(Shape7, [0, 0], "rr"), createBlock(Shape1, [1, 0]), createBlock(Shape2, [3, 0], "rr"), createBlock(Shape5, [0, 1], "rrrf"), createBlock(Shape1, [1, 2], "rr"), createBlock(Shape6, [3, 2], "rf"), createBlock(Shape7, [1, 3], "f"), createBlock(Shape4, [4, 4])],
		score: 2000000
	};
}

function sample2160() {
	return {
		blocks: [createBlock(Shape7, [1, 0]), createBlock(Shape6, [4, 1], "r"), createBlock(Shape7, [0, 2], "rrr"), createBlock(Shape3, [2, 2]), createBlock(Shape4, [4, 3]), createBlock(Shape7, [2, 4], "rr")],
		score: 2160
	};
}

function sample3600() {
	return {
		blocks: [createBlock(Shape6, [0, 0], "r"), createBlock(Shape7, [0, 0], "rrf"), createBlock(Shape4, [0, 2]), createBlock(Shape2, [1, 1], "f")],
		score: 3600
	};
}

export function getSampleBlocks() {
	return [sample640(), sample64(), sample800(), sample48(), sample480(), sample200000(), sample2000000(), sample2160(), sample3600()];
}
