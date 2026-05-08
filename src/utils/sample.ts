import type { Block } from "@/game/blocks/block";
import { Shape1 } from "@/game/blocks/shape-1";
import { Shape2 } from "@/game/blocks/shape-2";
import { Shape3 } from "@/game/blocks/shape-3";
import { Shape4 } from "@/game/blocks/shape-4";
import { Shape5 } from "@/game/blocks/shape-5";
import { Shape6 } from "@/game/blocks/shape-6";
import { Shape7 } from "@/game/blocks/shape-7";

function sample18() {
	const sample: Block[] = [];
	let shape = new Shape5();
	shape.rotate();
	shape.rotate();
	shape.setPosition([0, 0]);
	sample.push(shape);

	shape = new Shape2();
	shape.rotate();
	shape.rotate();
	shape.setPosition([0, 0]);
	sample.push(shape);
	return {
		blocks: sample,
		score: 18
	};
}

function sample64() {
	const sample: Block[] = [];
	let shape = new Shape5();
	shape.setPosition([0, 0]);
	sample.push(shape);

	shape = new Shape5();
	shape.rotate();
	shape.rotate();
	shape.setPosition([1, 1]);
	sample.push(shape);

	shape = new Shape4();
	shape.setPosition([0, 3]);
	sample.push(shape);

	shape = new Shape4();
	shape.setPosition([3, 0]);
	sample.push(shape);
	return {
		blocks: sample,
		score: 64
	};
}

function sample48() {
	const sample: Block[] = [];
	let shape = new Shape2();
	shape.rotate();
	shape.rotate();
	shape.rotate();
	shape.setPosition([0, 0]);
	sample.push(shape);

	shape = new Shape2();
	shape.rotate();
	shape.rotate();
	shape.setPosition([0, 2]);
	sample.push(shape);

	shape = new Shape1();
	shape.rotate();
	shape.setPosition([2, 0]);
	sample.push(shape);

	return {
		blocks: sample,
		score: 48
	};
}

function sample800_1() {
	const sample: Block[] = [];
	let shape = new Shape1();
	shape.setPosition([0, 0]);
	shape.rotate();
	shape.rotate();
	sample.push(shape);

	shape = new Shape1();
	shape.rotate();
	shape.rotate();
	shape.rotate();
	shape.setPosition([2, 0]);
	sample.push(shape);

	shape = new Shape7();
	shape.rotate();
	shape.setPosition([0, 0]);
	sample.push(shape);

	shape = new Shape7();
	shape.flip();
	shape.setPosition([1, 2]);
	sample.push(shape);

	shape = new Shape4();
	shape.setPosition([0, 3]);
	sample.push(shape);

	return {
		blocks: sample,
		score: 800
	};
}

function sample800_2() {
	const sample: Block[] = [];
	let shape = new Shape1();
	shape.setPosition([0, 0]);
	shape.rotate();
	shape.rotate();
	sample.push(shape);

	shape = new Shape1();
	shape.rotate();
	shape.rotate();
	shape.rotate();
	shape.setPosition([2, 0]);
	sample.push(shape);

	shape = new Shape2();
	shape.setPosition([0, 0]);
	sample.push(shape);

	shape = new Shape2();
	shape.setPosition([2, 2]);
	sample.push(shape);

	shape = new Shape3();
	shape.setPosition([0, 2]);
	sample.push(shape);

	return {
		blocks: sample,
		score: 800
	};
}

function sample1750() {
	const sample: Block[] = [];
	let shape = new Shape7();
	shape.rotate();
	shape.rotate();
	shape.setPosition([0, 0]);
	sample.push(shape);

	shape = new Shape1();
	shape.setPosition([1, 0]);
	sample.push(shape);

	shape = new Shape2();
	shape.rotate();
	shape.rotate();
	shape.setPosition([3, 0]);
	sample.push(shape);

	shape = new Shape1();
	shape.rotate();
	shape.rotate();
	shape.setPosition([1, 2]);
	sample.push(shape);

	shape = new Shape7();
	shape.rotate();
	shape.flip();
	shape.setPosition([3, 2]);
	sample.push(shape);

	shape = new Shape1();
	shape.setPosition([0, 3]);
	sample.push(shape);

	shape = new Shape1();
	shape.rotate();
	shape.setPosition([0, 1]);
	sample.push(shape);

	return {
		blocks: sample,
		score: 1750
	};
}

function sample3600() {
	const sample: Block[] = [];
	let shape = new Shape6();
	shape.rotate();
	shape.setPosition([0, 0]);
	sample.push(shape);

	shape = new Shape7();
	shape.rotate();
	shape.rotate();
	shape.flip();
	shape.setPosition([0, 0]);
	sample.push(shape);

	shape = new Shape4();
	shape.setPosition([0, 2]);
	sample.push(shape);

	shape = new Shape2();
	shape.flip();
	shape.setPosition([1, 1]);
	sample.push(shape);

	return {
		blocks: sample,
		score: 3600
	};
}

function sample480() {
	const sample: Block[] = [];
	let shape = new Shape6();
	shape.rotate();
	shape.rotate();
	shape.setPosition([1, 2]);
	sample.push(shape);

	shape = new Shape2();
	shape.setPosition([2, 0]);
	sample.push(shape);

	shape = new Shape7();
	shape.rotate();
	shape.flip();
	shape.setPosition([0, 0]);
	sample.push(shape);
	return {
		blocks: sample,
		score: 480
	};
}

function sample20000() {
	const sample: Block[] = [];
	let shape = new Shape7();
	shape.rotate();
	shape.rotate();
	shape.setPosition([0, 0]);
	sample.push(shape);

	shape = new Shape1();
	shape.setPosition([1, 0]);
	sample.push(shape);

	shape = new Shape2();
	shape.rotate();
	shape.rotate();
	shape.setPosition([3, 0]);
	sample.push(shape);

	shape = new Shape7();
	shape.rotate();
	shape.setPosition([0, 1]);
	sample.push(shape);

	shape = new Shape1();
	shape.rotate();
	shape.rotate();
	shape.setPosition([1, 2]);
	sample.push(shape);

	shape = new Shape7();
	shape.rotate();
	shape.flip();
	shape.setPosition([3, 2]);
	sample.push(shape);

	shape = new Shape4();
	shape.rotate();
	shape.flip();
	shape.setPosition([0, 4]);
	sample.push(shape);

	shape = new Shape7();
	shape.rotate();
	shape.flip();
	shape.rotate();
	shape.setPosition([1, 3]);
	sample.push(shape);
	return {
		blocks: sample,
		score: 20000
	};
}

function sample2160() {
	const sample: Block[] = [];
	let shape = new Shape7();
	shape.setPosition([1, 0]);
	sample.push(shape);

	shape = new Shape6();
	shape.rotate();
	shape.setPosition([4, 1]);
	sample.push(shape);

	shape = new Shape7();
	shape.rotate();
	shape.rotate();
	shape.rotate();
	shape.setPosition([0, 2]);
	sample.push(shape);

	shape = new Shape3();
	shape.setPosition([2, 2]);
	sample.push(shape);

	shape = new Shape4();
	shape.setPosition([4, 3]);
	sample.push(shape);

	shape = new Shape7();
	shape.setPosition([2, 4]);
	shape.rotate();
	shape.rotate();
	sample.push(shape);
	return {
		blocks: sample,
		score: 2160
	};
}

function sample225000() {
	const sample: Block[] = [];
	let shape = new Shape7();
	shape.rotate();
	shape.rotate();
	shape.setPosition([0, 0]);
	sample.push(shape);

	shape = new Shape1();
	shape.setPosition([1, 0]);
	sample.push(shape);

	shape = new Shape2();
	shape.rotate();
	shape.rotate();
	shape.setPosition([3, 0]);
	sample.push(shape);

	shape = new Shape7();
	shape.rotate();
	shape.setPosition([0, 1]);
	sample.push(shape);

	shape = new Shape1();
	shape.rotate();
	shape.rotate();
	shape.setPosition([1, 2]);
	sample.push(shape);

	shape = new Shape6();
	shape.rotate();
	shape.flip();
	shape.setPosition([3, 2]);
	sample.push(shape);

	shape = new Shape4();
	shape.setPosition([0, 4]);
	sample.push(shape);

	shape = new Shape7();
	shape.flip();
	shape.setPosition([1, 3]);
	sample.push(shape);

	shape = new Shape4();
	shape.setPosition([4, 4]);
	sample.push(shape);
	return {
		blocks: sample,
		score: 225000
	};
}

function sample2000000() {
	const sample: Block[] = [];
	let shape = new Shape5();
	shape.setPosition([0, 0]);
	sample.push(shape);

	shape = new Shape4();
	shape.setPosition([3, 0]);
	sample.push(shape);

	shape = new Shape4();
	shape.setPosition([4, 0]);
	sample.push(shape);

	shape = new Shape6();
	shape.rotate();
	shape.setPosition([1, 1]);
	sample.push(shape);

	shape = new Shape2();
	shape.rotate();
	shape.setPosition([3, 1]);
	sample.push(shape);

	shape = new Shape1();
	shape.rotate();
	shape.flip();
	shape.setPosition([3, 1]);
	sample.push(shape);

	shape = new Shape3();
	shape.setPosition([0, 3]);
	sample.push(shape);

	shape = new Shape7();
	shape.flip();
	shape.setPosition([2, 3]);
	sample.push(shape);
	return {
		blocks: sample,
		score: 2000000
	};
}

function sample704000() {
	const sample: Block[] = [];
	let shape = new Shape7();
	shape.flip();
	shape.setPosition([3, 0]);
	sample.push(shape);

	shape = new Shape6();
	shape.rotate();
	shape.rotate();
	shape.rotate();
	shape.setPosition([2, 1]);
	sample.push(shape);

	shape = new Shape5();
	shape.rotate();
	shape.rotate();
	shape.setPosition([2, 2]);
	sample.push(shape);

	shape = new Shape4();
	shape.setPosition([5, 2]);
	sample.push(shape);

	shape = new Shape4();
	shape.setPosition([5, 3]);
	sample.push(shape);

	shape = new Shape2();
	shape.setPosition([6, 2]);
	sample.push(shape);

	shape = new Shape2();
	shape.flip();
	shape.setPosition([0, 2]);
	sample.push(shape);

	shape = new Shape6();
	shape.rotate();
	shape.rotate();
	shape.flip();
	shape.setPosition([0, 4]);
	sample.push(shape);

	shape = new Shape7();
	shape.rotate();
	shape.rotate();
	shape.setPosition([5, 4]);
	sample.push(shape);

	shape = new Shape7();
	shape.rotate();
	shape.rotate();
	shape.rotate();
	shape.flip();
	shape.setPosition([4, 5]);
	sample.push(shape);

	shape = new Shape7();
	shape.rotate();
	shape.rotate();
	shape.rotate();
	shape.setPosition([2, 5]);
	sample.push(shape);
	return {
		blocks: sample,
		score: 704000
	};
}

export function getSampleBlocks() {
	return [sample18(), sample64(), sample48(), sample800_1(), sample800_2(), sample1750(), sample3600(), sample480(), sample20000(), sample2160(), sample225000(), sample2000000(), sample704000()];
}
