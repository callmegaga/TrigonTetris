<template>
	<div ref="container" class="container" :class="{ leaving: isLeaving }" :style="transition_style" @click="onClick" @transitionend="onTransitionEnd">
		<video autoplay loop muted>
			<source src="/video/fish_eating.mp4" type="video/mp4" />
			您的浏览器不支持视频播放。
		</video>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

const props = withDefaults(
	defineProps<{
		isLeaving?: boolean;
		translateX?: number;
		translateY?: number;
		scale?: number;
	}>(),
	{
		isLeaving: false,
		translateX: 0,
		translateY: 0,
		scale: 0.28
	}
);

const emit = defineEmits<{
	start: [];
	transitionComplete: [];
}>();

const container = ref<HTMLElement | null>(null);
const has_emitted_transition_complete = ref(false);
const transition_style = computed(() => ({
	"--welcome-transition-x": `${props.translateX}px`,
	"--welcome-transition-y": `${props.translateY}px`,
	"--welcome-transition-scale": props.scale.toString()
}));

function onClick() {
	if (props.isLeaving) return;
	emit("start");
}

function onTransitionEnd(event: TransitionEvent) {
	if (!props.isLeaving || has_emitted_transition_complete.value || event.target !== container.value) return;
	if (event.propertyName !== "transform") return;

	has_emitted_transition_complete.value = true;
	emit("transitionComplete");
}
</script>

<style scoped>
.container {
	display: flex;
	width: 100%;
	height: 100%;
	justify-content: center;
	cursor: pointer;
	background-color: white;
	transform-origin: center center;
	transition:
		transform 760ms cubic-bezier(0.22, 1, 0.36, 1),
		opacity 760ms ease,
		border-radius 760ms ease,
		box-shadow 760ms ease;
	will-change: transform, opacity;

	video {
		width: 100%;
		object-fit: cover;
	}
}

.container.leaving {
	pointer-events: none;
	opacity: 0;
	border-radius: 8px;
	box-shadow: 0 18px 55px rgba(15, 23, 42, 0.24);
	transform: translate3d(var(--welcome-transition-x), var(--welcome-transition-y), 0) scale(var(--welcome-transition-scale));
}
</style>
