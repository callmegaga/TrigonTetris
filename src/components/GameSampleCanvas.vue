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

const props = withDefaults(
	defineProps<{
		cellSize?: number;
	}>(),
	{
		cellSize: 30
	}
);

interface SampleImages {
	images: string;
	score: number;
}

const all_samples = getSampleBlocks();

const sample_images = ref<SampleImages[]>([]);

onMounted(() => {
	renderer = new SampleRenderer(props.cellSize);
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
	display: flex;
	flex-wrap: wrap;
	width: 100%;
	justify-content: center;
	align-content: flex-start;
	align-items: flex-start;
	gap: 16px;

	.sample {
		flex: 0 0 auto;
		position: relative;
		width: max-content;

		.img {
			width: auto;
			max-width: none;
			height: auto;
			display: block;
			margin: 0 auto;
		}

		.score {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			margin: 0;
			padding: 3px 7px;
			border-radius: 999px;
			background: rgba(15, 23, 42, 0.72);
			color: #ffffff;
			font-size: clamp(11px, 0.9vw, 14px);
			font-weight: 700;
			line-height: 1.2;
			white-space: nowrap;
			overflow-wrap: anywhere;
			pointer-events: none;
		}
	}
}
</style>
