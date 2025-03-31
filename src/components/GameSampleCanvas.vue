<template>
	<img v-for="(sample, index) in sample_images" :key="index" :src="sample.images" class="sample" />
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { SampleRenderer } from "@/game/renderer/canvas/sample_renderer";
import type { Block } from "@/game/blocks/block";
import { Shape1 } from "@/game/blocks/shape-1";

let renderer: SampleRenderer;

interface Sample {
	blocks: Block[];
	score: number;
}

interface SampleImages {
	images: string;
	score: number;
}

const shape = new Shape1();
shape.setPosition([0, 0]);
const samples: Sample[] = [{ blocks: [], score: 2 }];
const sample_images = ref<SampleImages[]>([]);

onMounted(() => {
	renderer = new SampleRenderer(30);
	sample_images.value = samples.map((sample) => {
		return {
			images: renderer.drawSample(sample.blocks),
			score: sample.score
		};
	});
	console.log(renderer);
});
</script>

<style scoped>
.sample-container {
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
}

.sample {
	width: 80%;
	max-width: 300px;
	aspect-ratio: 1;
	background-color: rgba(255, 255, 255, 0.1);
	border-radius: 8px;
	overflow: hidden;
}
</style>
