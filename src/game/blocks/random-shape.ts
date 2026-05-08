import type { Block } from "@/game/blocks/block";
import { Shape1 } from "@/game/blocks/shape-1";
import { Shape2 } from "@/game/blocks/shape-2";
import { Shape3 } from "@/game/blocks/shape-3";
import { Shape4 } from "@/game/blocks/shape-4";
import { Shape5 } from "@/game/blocks/shape-5";
import { Shape6 } from "@/game/blocks/shape-6";
import { Shape7 } from "@/game/blocks/shape-7";

const ShapeTable: { new (): Block }[] = [Shape1, Shape2, Shape3, Shape4, Shape5, Shape6, Shape7];

export function getRandomShape() {
	// 概率5-4-4-1-3-3-5
	const random = Math.random();
	const sum = 5 + 4 + 4 + 1 + 3 + 3 + 5;
	if (random <= 5 / sum) return ShapeTable[0];
	if (random <= (5 + 4) / sum) return ShapeTable[1];
	if (random <= (5 + 4 + 4) / sum) return ShapeTable[2];
	if (random <= (5 + 4 + 4 + 1) / sum) return ShapeTable[3];
	if (random <= (5 + 4 + 4 + 1 + 3) / sum) return ShapeTable[4];
	if (random <= (5 + 4 + 4 + 1 + 3 + 3) / sum) return ShapeTable[5];
	return ShapeTable[6];
}
