<template>
	<div class="sample-container">
		<div ref="container" class="sample"></div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { SampleRenderer } from '@/game/renderer/sample_renderer';

const container = ref<HTMLElement | null>(null);
let renderer: SampleRenderer | null = null;

onMounted(() => {
	if (container.value) {
		renderer = new SampleRenderer(container.value);
		renderer.start();
	}
});

onUnmounted(() => {
	if (renderer) {
		renderer.destroy();
		renderer = null;
	}
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