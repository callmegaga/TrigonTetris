<template>
	<div class="sample-intro" :style="intro_style" data-testid="sample-intro">
		<canvas ref="intro_canvas" class="sample-intro-canvas"></canvas>
	</div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from "vue";
import { SampleIntroRenderer } from "@/game/renderer/canvas/sample_intro_renderer";

const props = withDefaults(
	defineProps<{
		cellSize?: number;
	}>(),
	{
		cellSize: 30
	}
);

const emit = defineEmits<{
	complete: [];
}>();

let intro_renderer: SampleIntroRenderer | null = null;

const intro_canvas = ref<HTMLCanvasElement | null>(null);
const intro_style = computed(() => ({
	"--sample-intro-cell-size": `${props.cellSize}px`
}));

onMounted(async () => {
	await nextTick();
	if (!intro_canvas.value) return;

	intro_renderer = new SampleIntroRenderer(intro_canvas.value, props.cellSize, () => {
		emit("complete");
	});
	intro_renderer.play();
});

onUnmounted(() => {
	intro_renderer?.stop();
	intro_renderer = null;
});
</script>

<style scoped>
.sample-intro {
	width: 100%;
	min-height: calc(var(--sample-intro-cell-size, 24px) * 6);
	display: flex;
	align-items: flex-start;
	justify-content: center;
	padding-top: 8px;
	box-sizing: border-box;
}

.sample-intro-canvas {
	display: block;
	width: auto;
	max-width: none;
	height: auto;
}
</style>
