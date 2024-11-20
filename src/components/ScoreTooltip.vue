<template>
	<Transition>
		<div class="score-tooltip" v-if="is_show">
			<!--		<div class="cloud"></div>-->
			<div class="score">
				{{ props.score }}
			</div>
		</div>
	</Transition>
</template>

<script setup lang="ts">
import { computed, watch, ref } from "vue";

const props = defineProps<{
	score: number;
	top: number;
	left: number;
}>();

const is_show = ref(false);

watch(
	() => props.score,
	(new_score) => {
		console.log("new_score", new_score);
		if (new_score === 0) {
			return;
		}
		is_show.value = true;

		setTimeout(() => {
			is_show.value = false;
		}, 2000);
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
.v-enter-active,
.v-leave-active {
	transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
	opacity: 0;
}

.score-tooltip {
	position: absolute;
	top: v-bind(top);
	left: v-bind(left);
	transform: translateX(-50%) translateY(-50%);
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
