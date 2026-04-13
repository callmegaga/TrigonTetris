<template>
	<main class="restore-page">
		<section class="restore-header">
			<div>
				<h1>反馈现场恢复</h1>
				<p v-if="snapshot">
					{{ snapshot.submittedAt }} · 状态 {{ snapshot.gameStatus }} · 分数 {{ snapshot.score }}
				</p>
				<p v-else>未找到可恢复的现场快照。</p>
			</div>
			<button type="button" class="ghost-button" @click="reloadFromStorage">重新读取</button>
		</section>

		<section v-if="snapshot" class="restore-layout">
			<div class="restore-board-panel">
				<div ref="gameContainer" class="restore-board"></div>
			</div>
			<aside class="restore-side-panel">
				<div class="restore-score-card">
					<div class="label">当前分数</div>
					<div class="value">{{ snapshot.score }}</div>
				</div>
				<div class="restore-score-card">
					<div class="label">历史最高</div>
					<div class="value">{{ snapshot.maxScore }}</div>
				</div>
				<div class="restore-next-card">
					<div class="label">后续方块</div>
					<div ref="nextContainer" class="next-preview"></div>
				</div>
				<pre class="snapshot-json">{{ formattedSnapshot }}</pre>
			</aside>
		</section>
	</main>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from "vue";
import { ACTIVE_BOARD_ROWS, GAME_BOARD_COL, GAME_BOARD_ROW } from "@/game/config";
import { renderSnapshot } from "@/feedback/render";
import type { GameSnapshot } from "@/feedback/types";

const STORAGE_KEY = "bug-feedback-restore-snapshot";

const snapshot = ref<GameSnapshot | null>(null);
const gameContainer = ref<HTMLElement | null>(null);
const nextContainer = ref<HTMLElement | null>(null);

const formattedSnapshot = computed(() => JSON.stringify(snapshot.value, null, 2));

function reloadFromStorage() {
	const stored = localStorage.getItem(STORAGE_KEY);
	if (!stored) {
		snapshot.value = null;
		return;
	}

	try {
		snapshot.value = JSON.parse(stored) as GameSnapshot;
		void nextTick().then(() => {
			if (!snapshot.value || !gameContainer.value || !nextContainer.value) return;
			renderSnapshot(snapshot.value, gameContainer.value, nextContainer.value, getCellSize());
		});
	} catch (error) {
		console.error("failed to parse restore snapshot", error);
		snapshot.value = null;
	}
}

function getCellSize() {
	const width = Math.max(window.innerWidth * 0.48, 320);
	const height = Math.max(window.innerHeight * 0.72, 640);
	const cellWidth = Math.floor(width / GAME_BOARD_COL);
	const cellHeight = Math.floor(height / (GAME_BOARD_ROW + ACTIVE_BOARD_ROWS));
	return Math.max(12, Math.min(cellWidth, cellHeight));
}

onMounted(() => {
	reloadFromStorage();
});
</script>

<style scoped>
.restore-page {
	min-height: 100%;
	background: linear-gradient(180deg, #0f172a 0%, #111827 100%);
	color: #e5eef9;
	padding: 24px;
	box-sizing: border-box;
}

.restore-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	gap: 16px;
	margin-bottom: 24px;
}

.restore-header h1 {
	margin: 0 0 8px;
	font-size: 32px;
}

.restore-header p {
	margin: 0;
	color: #b6c3d6;
}

.restore-layout {
	display: grid;
	grid-template-columns: minmax(320px, 1fr) 360px;
	gap: 24px;
	align-items: start;
}

.restore-board-panel,
.restore-side-panel {
	background: rgba(15, 23, 42, 0.76);
	border: 1px solid rgba(148, 163, 184, 0.24);
	border-radius: 20px;
	padding: 20px;
	box-sizing: border-box;
}

.restore-board-panel {
	display: flex;
	justify-content: center;
}

.restore-board {
	display: flex;
	justify-content: center;
	align-items: center;
	min-height: 640px;
}

.restore-side-panel {
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.restore-score-card,
.restore-next-card {
	background: rgba(30, 41, 59, 0.84);
	border-radius: 14px;
	padding: 16px;
}

.label {
	font-size: 14px;
	color: #9fb0c7;
	margin-bottom: 8px;
}

.value {
	font-size: 28px;
	font-weight: 700;
}

.next-preview {
	display: inline-flex;
}

.snapshot-json {
	margin: 0;
	background: #020617;
	border-radius: 14px;
	padding: 16px;
	overflow: auto;
	max-height: 420px;
	color: #bfdbfe;
	font-size: 12px;
	line-height: 1.5;
}

.ghost-button {
	border: 1px solid rgba(148, 163, 184, 0.4);
	background: transparent;
	color: #e5eef9;
	border-radius: 999px;
	padding: 10px 16px;
	cursor: pointer;
}

@media (max-width: 1024px) {
	.restore-layout {
		grid-template-columns: 1fr;
	}

	.restore-side-panel {
		order: -1;
	}

	.restore-board {
		min-height: 0;
	}
}
</style>
