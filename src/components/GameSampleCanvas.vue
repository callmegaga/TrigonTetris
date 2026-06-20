<template>
	<sample-intro-animation v-if="is_playing_intro" :key="playIntroToken" :cell-size="cellSize" @complete="onIntroComplete" />
	<div v-else-if="!hideSamples" class="sample-wrapper">
		<div class="sample" v-for="(sample, index) in sample_images" :key="index">
			<img class="img" :src="sample.images" :alt="sample.score.toString()" />
			<p class="score">{{ `${sample.score}分` }}</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from "vue";
import SampleIntroAnimation from "@/components/SampleIntroAnimation.vue";
import { SampleRenderer } from "@/game/renderer/canvas/sample_renderer";
import { getSampleBlocks } from "@/utils/sample";

let renderer: SampleRenderer;
let active_intro_token = 0;

const props = withDefaults(
	defineProps<{
		cellSize?: number;
		playIntroToken?: number;
		hideSamples?: boolean;
	}>(),
	{
		cellSize: 30,
		playIntroToken: 0,
		hideSamples: false
	}
);
const emit = defineEmits<{
	sampleIntroComplete: [];
}>();

interface SampleImages {
	images: string;
	score: number;
}

const all_samples = getSampleBlocks();

const sample_images = ref<SampleImages[]>([]);
const is_playing_intro = ref(false);

onMounted(() => {
	renderer = new SampleRenderer(props.cellSize);
	sample_images.value = all_samples.map((sample) => {
		return {
			images: renderer.drawSample(sample.blocks),
			score: sample.score
		};
	});
});

watch(
	() => props.playIntroToken,
	(token, previous_token) => {
		if (token === 0 || token === previous_token) return;
		playIntro(token);
	}
);

function playIntro(token: number) {
	active_intro_token = token;
	is_playing_intro.value = true;
}

async function onIntroComplete() {
	if (active_intro_token !== props.playIntroToken) return;
	is_playing_intro.value = false;
	await nextTick();
	emit("sampleIntroComplete");
}
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
