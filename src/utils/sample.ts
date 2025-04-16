import type { Block } from "@/game/blocks/block";
import { Shape1 } from "@/game/blocks/shape-1";
import { Shape2 } from "@/game/blocks/shape-2";
import { Shape3 } from "@/game/blocks/shape-3";
import { Shape4 } from "@/game/blocks/shape-4";
import { Shape5 } from "@/game/blocks/shape-5";
import { Shape6 } from "@/game/blocks/shape-6";
import { Shape7 } from "@/game/blocks/shape-7";

function sample450() {
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
		score: 450
	};
}

function sample1600() {
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
		score: 1600
	};
}

function sample4800() {
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
		score: 4800
	};
}

function sample10000_1() {
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
		score: 10000
	};
}

function sample10000_2() {
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
		score: 10000
	};
}

function sample21875() {
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
		score: 21875
	};
}

function sample22500() {
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
		score: 22500
	};
}

function sample24000() {
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
		score: 24000
	};
}

function sample125000() {
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
		score: 125000
	};
}

function sample243000() {
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
		score: 243000
	};
}

function sample703125() {
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
		blocks:sample,
		score: 703125
	};
}

function sample3125000() {
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
		score: 3125000
	};
}

function sample176000000() {
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
		score: 176000000
	};
}

export function getSampleBlocks() {
	return [sample450(), sample1600(), sample4800(), sample10000_1(), sample10000_2(), sample21875(), sample22500(), sample24000(), sample125000(), sample243000(), sample703125(), sample3125000(), sample176000000()];
}
