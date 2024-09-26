<template>
	<div id="score">
		<div id="now_score" class="border-dashed score-box">{{ props.score }}</div>
		<div id="max_score" class="border-dashed score-box">{{ props.max_score }}</div>
	</div>
</template>

<script setup lang="ts">
import { withDefaults, defineProps } from "vue";

const props = withDefaults(
	defineProps<{
		score: number;
		max_score: number;
	}>(),
	{
		score: 0,
		max_score: 0
	}
);
</script>

<style scoped>
#score {
	padding: 60px 20%;
	text-align: center;
	font-size: 25px;
	font-weight: 900;
}

.score-box {
	position: relative;
	padding: 25px 25px 5px;
}

.score-box:before {
	position: absolute;
	top: -32px;
	left: 14px;
	font-size: 30px;
	font-weight: 900;
	background-color: #fff;
	padding: 10px 12px;
}

#now_score {
	margin-bottom: 40px;
}

#now_score:before {
	content: "分数";
	color: #ff514d;
}

#max_score:before {
	content: "最高分数";
	color: #ffa700;
}

.border-dashed {
	border: 5px dashed #ddd;
}
</style>
