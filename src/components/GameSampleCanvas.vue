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
import { getSampleBlocks } from "@/utils/sample";

let renderer: SampleRenderer;

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
});
</script>

<style scoped>
.sample-wrapper {
	display: grid;
	width: 100%;
	grid-template-columns: repeat(auto-fill, minmax(84px, 88px));
	justify-content: center;
	align-content: center;
	align-items: start;
	gap: 12px;

	.sample {
		min-width: 0;

		.img {
			width: 100%;
			max-width: 88px;
			height: auto;
			display: block;
			margin: 0 auto;
		}

		.score {
			margin: 4px 0 0;
			color: #dddddd;
			font-size: clamp(12px, 0.9vw, 14px);
			line-height: 1.2;
			overflow-wrap: anywhere;
		}
	}
}
</style>
