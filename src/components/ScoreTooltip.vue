<template>
	<div class="score-tooltip">
		<div class="cloud"></div>
		<div class="score">
			{{ props.score }}
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, watch, ref } from "vue";

const props = defineProps<{
	score: number;
	top: number;
	left: number;
}>();

const display = ref("none");

watch(
	() => props.score,
	(new_score) => {
		console.log("new_score", new_score);
		display.value = "block";

		setTimeout(() => {
			display.value = "none";
		}, 2500);
	}
);
const left = computed(() => {
	return props.left + "px";
});

const top = computed(() => {
	return props.top + "px";
});
</script>

<style scoped>
.score-tooltip {
	display: v-bind(display);
	position: absolute;
	top: v-bind(top);
	left: v-bind(left);
	width: 120px;
	height: 90px;
}

.score {
	position: absolute;
	width: 100%;
	top: 50%;
	text-align: center;
	font-size: 18px;
	font-weight: bold;
}

.cloud {
	width: 36px;
	height: 36px;
	background: #fff;
	border-radius: 50%;
	margin-top: 36px;
	box-shadow:
		#fff 10px -15px 0 6px,
		#fff 22px -15px 0 6px,
		#fff 57px -15px 0 2px,
		#fff 87px -10px 0 -4px,
		#fff 33px 6px 0 6px,
		#fff 61px 6px 0 2px,
		#fff 61px 16px 0 2px,
		#fff 87px 16px 0 -4px;
}
</style>
