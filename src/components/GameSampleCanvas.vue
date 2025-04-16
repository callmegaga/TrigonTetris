<template>
	<div class="sample-wrapper">
		<div class="sample" v-for="(sample, index) in sample_images" :key="index">
			<img class="img" :src="sample.images" :alt="sample.score.toString()" />
			<p class="score">{{ `${sample.score}分` }}</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { SampleRenderer } from "@/game/renderer/canvas/sample_renderer";
import type { Block } from "@/game/blocks/block";
import {getSampleBlocks} from "@/utils/sample";

let renderer: SampleRenderer;

interface Sample {
	blocks: Block[];
	score: number;
}

interface SampleImages {
	images: string;
	score: number;
}

const all_samples = getSampleBlocks();

const sample_images = ref<SampleImages[]>([]);

onMounted(() => {
	renderer = new SampleRenderer(30);
	sample_images.value = all_samples.map((sample) => {
		return {
			images: renderer.drawSample(sample.blocks),
			score: sample.score
		};
	});
	console.log(renderer);
});
</script>

<style scoped>
.sample-wrapper {
	display: flex;
	width: 100%;
	justify-content: center;
	align-items: center;
	flex-wrap: wrap;
	gap: 10px;

	.sample {
		width: 30%;
		max-width: 80px;

		.img {
			width: 100%;
			height: auto;
		}

		.score {
			margin: 0;
			color: #dddddd;
			font-size: 14px;
		}
	}
}
</style>
