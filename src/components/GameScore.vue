<template>
	<div class="score-panel">
		<div class="score-card current-score">
			<div class="score-label">分数</div>
			<div class="score-value">{{ props.score }}</div>
		</div>
		<div class="score-card high-score">
			<div class="score-label">最高分数</div>
			<div class="score-value">{{ props.maxScore }}</div>
		</div>
	</div>
</template>

<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		score: number;
		maxScore: number;
	}>(),
	{
		score: 0,
		maxScore: 0
	}
);
</script>

<style scoped>
.score-panel {
	display: flex;
	flex-direction: column;
	gap: 16px;
	width: 100%;
	max-width: 400px;
}

.score-card {
	background-color: rgba(15, 23, 42, 0.7);
	border-radius: 10px;
	padding: 12px;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
	border-left: 4px solid transparent;
	transition: transform 0.2s ease;
}

.score-card:hover {
	transform: translateY(-2px);
}

.current-score {
	border-left-color: #ef4444; /* 红色边框 */
}

.high-score {
	border-left-color: #f59e0b; /* 黄色边框 */
}

.score-label {
	font-size: 16px;
	font-weight: bold;
	margin-bottom: 8px;
	color: #e2e8f0;
	display: flex;
	align-items: center;
}

.current-score .score-label {
	color: #fca5a5; /* 浅红色 */
}

.high-score .score-label {
	color: #fcd34d; /* 浅黄色 */
}

.score-label::before {
	content: "";
	display: inline-block;
	width: 8px;
	height: 8px;
	border-radius: 50%;
	margin-right: 8px;
}

.current-score .score-label::before {
	background-color: #ef4444;
}

.high-score .score-label::before {
	background-color: #f59e0b;
}

.score-value {
	font-size: 28px;
	font-weight: bold;
	color: white;
	text-align: right;
	font-family: "Courier New", monospace;
}
</style>
