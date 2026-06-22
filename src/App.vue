<template>
	<main :style="layout_style">
		<button v-if="!is_show_welcome" type="button" class="bug-feedback-button" @click="openFeedbackModal">BUG反馈</button>
		<aside class="left-panel">
			<div class="left-panel-content">
				<game-score :score="score" :max-score="max_score" id="score" />
				<div class="next-panel">
					<div id="next"></div>
				</div>
				<game-keyboard class="game-controller" id="keyboard" />
			</div>
		</aside>
		<section class="board-panel">
			<div class="game" id="game"></div>
		</section>
		<aside class="sample-panel">
			<game-sample-canvas class="game-sample" id="sample" :cell-size="cell_size" :play-intro-token="sample_intro_token" :hide-samples="is_welcome_leaving" @sample-intro-complete="onSampleIntroComplete" />
		</aside>
	</main>
	<the-welcome v-if="is_show_welcome" class="welcome" :is-leaving="is_welcome_leaving" :translate-x="welcome_transition.translateX" :translate-y="welcome_transition.translateY" :scale="welcome_transition.scale" @start="startWelcomeTransition" @transition-complete="startSampleIntro" />
	<game-over v-if="is_game_over" />
	<score-tooltip :score="new_score" :left="new_score_left" :top="new_score_top" />
	<bug-feedback-modal v-if="is_feedback_modal_open" :description="feedback_description" :submitting="is_feedback_submitting" :message="feedback_message" :is-error="is_feedback_error" :can-submit="feedback_description.trim().length <= 100" :remaining="100 - feedback_description.length" @close="closeFeedbackModal" @submit="submitFeedback" @update:description="feedback_description = $event" />
</template>

<script setup lang="ts">
import TheWelcome from "@/components/TheWelcome.vue";
import { Game, ScoreType } from "@/game/game";
import { computed, nextTick, onMounted, onUnmounted, ref } from "vue";
import GameSampleCanvas from "@/components/GameSampleCanvas.vue";
import GameScore from "@/components/GameScore.vue";
import { ACTIVE_BOARD_ROWS, GAME_BOARD_COL, GAME_BOARD_ROW, MAX_SHAPE_SIZE, STAND_BY_COUNT } from "@/game/config";
import { getElementScreenPosition, getHistoryMaxScore, getSquareCenterPixelPosition, setHistoryMaxScore } from "@/utils/utils";
import GameOver from "@/components/GameOver.vue";
import ScoreTooltip from "@/components/ScoreTooltip.vue";
import type { BevelledSquare, NormalSquare } from "@/game/types";
import GameKeyboard from "@/components/GameKeyboard.vue";
import { audioManager, SoundEffect } from "@/utils/audio_manager";
import introJs from "intro.js";
import "intro.js/introjs.css";
import BugFeedbackModal from "@/components/BugFeedbackModal.vue";
import type { ClientEnvironment, SnapshotRect } from "@/feedback/types";

const is_show_welcome = ref(true);
const is_game_over = ref(false);
const score = ref(0);
const new_score = ref(0);
const max_score = ref(0);
const new_score_top = ref(100);
const new_score_left = ref(100);
const is_feedback_modal_open = ref(false);
const is_feedback_submitting = ref(false);
const is_feedback_error = ref(false);
const feedback_description = ref("");
const feedback_message = ref("");
const sample_intro_token = ref(0);
const is_welcome_leaving = ref(false);
const welcome_transition = ref({
	translateX: 0,
	translateY: 0,
	scale: 0.28
});

let game: Game | null = null;
const SAMPLE_INTRO_STORAGE_KEY = "is_show_sample_intro";

function introStart() {
	return new Promise<void>((resolve) => {
		if (localStorage.getItem("is_show_intro")) {
			resolve();
			return;
		}
		introJs()
			.setOptions({
				nextLabel: "下一步",
				prevLabel: "上一步",
				doneLabel: "完成"
			})
			.addSteps([
				{
					element: document.querySelector("#keyboard") as HTMLElement,
					intro: "使用键盘来控制游戏",
					position: "right"
				},
				{
					element: document.querySelector("#sample") as HTMLElement,
					intro: "这是得分的示例，你还可以自己创造更多的拼凑",
					position: "left"
				},
				{
					element: document.querySelector("#game") as HTMLElement,
					intro: '拼凑成正方形或斜正方形，将消除拼凑图形上下左右的元素，超过游戏区域将进入"续命"',
					position: "floating"
				},
				{
					element: document.querySelector("#next") as HTMLElement,
					intro: "这是后续将出现的元素",
					position: "left"
				},
				{
					element: document.querySelector("#score") as HTMLElement,
					intro: "这里记录当前游戏的分数和历史最高分数",
					position: "right"
				},
				{
					title: "玩得越多，游戏越简单",
					intro: "得分越多，学会拼凑的图形越多，游戏也会越简单，可以从最简单的图形开始，快来试试吧"
				}
			])
			.oncomplete(() => {
				localStorage.setItem("is_show_intro", "true");
				resolve();
			})
			.onexit(() => {
				localStorage.setItem("is_show_intro", "true");
				resolve();
			})
			.start();
	});
}

function startWelcomeTransition() {
	welcome_transition.value = getWelcomeTransition();
	is_welcome_leaving.value = true;
}

function startSampleIntro() {
	is_show_welcome.value = false;
	is_welcome_leaving.value = false;
	introStart().then(() => {
		if (localStorage.getItem(SAMPLE_INTRO_STORAGE_KEY)) {
			nextTick(() => {
				startGameLoop();
			});
			return;
		}
		sample_intro_token.value++;
	});
}

function startGameLoop() {
	game?.start();
}

function onSampleIntroComplete() {
	localStorage.setItem(SAMPLE_INTRO_STORAGE_KEY, "true");
	startGameLoop();
}

const board_rows = GAME_BOARD_ROW + ACTIVE_BOARD_ROWS;
const next_columns = MAX_SHAPE_SIZE[0] * STAND_BY_COUNT + 3;
const cell_size = getCellSize(window.innerWidth, window.innerHeight, GAME_BOARD_COL, board_rows);
const board_width = cell_size * GAME_BOARD_COL;
const board_height = cell_size * board_rows;
const next_panel_width = cell_size * next_columns + 20;
const layout_style = computed(() => ({
	"--board-width": `${board_width}px`,
	"--board-height": `${board_height}px`,
	"--next-panel-width": `${next_panel_width}px`
}));

function onScore(gain: number, square: NormalSquare | BevelledSquare, type: ScoreType) {
	if (gain === 0) {
		return;
	}
	const square_center_position = getSquareCenterPixelPosition(square, cell_size);
	const element_position = getElementScreenPosition(document.querySelector("#game canvas") as HTMLElement);

	new_score_left.value = square_center_position[0] + element_position[0];
	new_score_top.value = square_center_position[1] + element_position[1];
	score.value += gain;
	new_score.value = gain;

	setTimeout(() => {
		new_score.value = 0;
	}, 2500);

	if (type === ScoreType.Perfect) {
		audioManager.play(SoundEffect.CHEER);
		setTimeout(() => {
			audioManager.play(SoundEffect.SHOOO);
		}, 1000);
	} else {
		setTimeout(() => {
			audioManager.play(SoundEffect.SHOOO);
		}, 3000);
	}
	if (score.value > max_score.value) {
		max_score.value = score.value;
		setHistoryMaxScore(score.value);
	}
}

function onFail() {
	is_game_over.value = true;
	game?.end();
}

onMounted(() => {
	max_score.value = getHistoryMaxScore();

	game = new Game({
		game_container: document.querySelector("#game") as HTMLElement,
		columns: GAME_BOARD_COL,
		rows: GAME_BOARD_ROW,
		board_cell_size: cell_size,
		onScore: onScore,
		onFail: onFail,
		next_container: document.querySelector("#next") as HTMLElement,
		onJump: () => {
			audioManager.play(SoundEffect.JUMP);
		},
		onRotate: () => {
			audioManager.play(SoundEffect.ROTATE);
		},
		onMove: () => {
			audioManager.play(SoundEffect.MOVE);
		},
		onFlip: () => {
			audioManager.play(SoundEffect.FLIP);
		}
	});
});

async function openFeedbackModal() {
	if (!game) return;

	game.pause();
	feedback_description.value = "";
	feedback_message.value = "";
	is_feedback_error.value = false;
	is_feedback_submitting.value = false;
	is_feedback_modal_open.value = true;
}

function closeFeedbackModal() {
	if (is_feedback_submitting.value) return;
	is_feedback_modal_open.value = false;
	feedback_description.value = "";
	feedback_message.value = "";
	is_feedback_error.value = false;
	game?.resume();
}

async function submitFeedback() {
	if (!game) return;

	const description = feedback_description.value.trim();
	if (!description || description.length > 100) {
		is_feedback_error.value = true;
		feedback_message.value = "描述不能为空，且不能超过 100 字。";
		return;
	}

	is_feedback_submitting.value = true;
	is_feedback_error.value = false;
	feedback_message.value = "";

	try {
		const snapshot = game.getSnapshot(score.value, max_score.value, collectClientEnvironment());
		const screenshotBlob = await captureGameCanvas();
		const formData = new FormData();
		formData.set("description", description);
		formData.set("snapshot", JSON.stringify(snapshot));
		formData.set("pathname", window.location.pathname);
		if (screenshotBlob) {
			formData.set("screenshot", screenshotBlob, `feedback-${Date.now()}.png`);
		}

		const response = await fetch("/api/feedback", {
			method: "POST",
			body: formData
		});
		if (!response.ok) {
			throw new Error(await response.text());
		}

		feedback_message.value = "反馈已提交，感谢帮助定位问题。";
		setTimeout(() => {
			is_feedback_submitting.value = false;
			closeFeedbackModal();
		}, 700);
	} catch (error) {
		console.error(error);
		is_feedback_error.value = true;
		feedback_message.value = error instanceof Error ? error.message : "提交失败，请稍后再试。";
		is_feedback_submitting.value = false;
	}
}

async function captureGameCanvas() {
	const canvas = document.querySelector("#game canvas") as HTMLCanvasElement | null;
	if (!canvas) return null;

	return new Promise<Blob | null>((resolve) => {
		canvas.toBlob((blob) => resolve(blob), "image/png");
	});
}

function collectClientEnvironment(): ClientEnvironment {
	const document_element = document.documentElement;
	const orientation = screen.orientation;

	return {
		userAgent: navigator.userAgent,
		language: navigator.language,
		languages: Array.from(navigator.languages ?? []),
		platform: navigator.platform,
		vendor: navigator.vendor,
		cookieEnabled: navigator.cookieEnabled,
		onLine: navigator.onLine,
		devicePixelRatio: window.devicePixelRatio,
		window: {
			innerWidth: window.innerWidth,
			innerHeight: window.innerHeight,
			outerWidth: window.outerWidth,
			outerHeight: window.outerHeight,
			scrollX: window.scrollX,
			scrollY: window.scrollY
		},
		screen: {
			width: screen.width,
			height: screen.height,
			availWidth: screen.availWidth,
			availHeight: screen.availHeight,
			colorDepth: screen.colorDepth,
			pixelDepth: screen.pixelDepth,
			orientationType: orientation?.type ?? "",
			orientationAngle: orientation?.angle ?? 0
		},
		visualViewport: window.visualViewport
			? {
					width: window.visualViewport.width,
					height: window.visualViewport.height,
					scale: window.visualViewport.scale,
					offsetLeft: window.visualViewport.offsetLeft,
					offsetTop: window.visualViewport.offsetTop,
					pageLeft: window.visualViewport.pageLeft,
					pageTop: window.visualViewport.pageTop
				}
			: null,
		document: {
			clientWidth: document_element.clientWidth,
			clientHeight: document_element.clientHeight,
			scrollWidth: document_element.scrollWidth,
			scrollHeight: document_element.scrollHeight
		},
		layout: {
			cellSize: cell_size,
			boardColumns: GAME_BOARD_COL,
			boardRows: board_rows,
			boardPixelWidth: board_width,
			boardPixelHeight: board_height,
			body: getRequiredElementRect(document.body),
			main: getElementRect(document.querySelector("main")),
			boardPanel: getElementRect(document.querySelector(".board-panel")),
			game: getElementRect(document.querySelector("#game")),
			gameCanvas: getElementRect(document.querySelector("#game canvas")),
			leftPanel: getElementRect(document.querySelector(".left-panel")),
			samplePanel: getElementRect(document.querySelector(".sample-panel")),
			sample: getElementRect(document.querySelector("#sample")),
			next: getElementRect(document.querySelector("#next")),
			samplesVisible: document.querySelectorAll(".sample-wrapper .sample").length,
			sampleIntroVisible: Boolean(document.querySelector("[data-testid='sample-intro']"))
		}
	};
}

function getElementRect(element: Element | null): SnapshotRect | null {
	if (!element) return null;
	return getRequiredElementRect(element);
}

function getRequiredElementRect(element: Element): SnapshotRect {
	const rect = element.getBoundingClientRect();

	return {
		x: roundMetric(rect.x),
		y: roundMetric(rect.y),
		width: roundMetric(rect.width),
		height: roundMetric(rect.height),
		top: roundMetric(rect.top),
		right: roundMetric(rect.right),
		bottom: roundMetric(rect.bottom),
		left: roundMetric(rect.left)
	};
}

function roundMetric(value: number) {
	return Math.round(value * 100) / 100;
}

function getCellSize(dom_width: number, dom_height: number, columns: number, rows: number) {
	const page_padding = 32;
	const column_gap = 24;
	const min_side_panel_width = 180;
	const min_cell_size = 16;
	const available_height = dom_height - page_padding * 2;
	const available_board_width = dom_width - page_padding * 2 - column_gap * 2 - min_side_panel_width * 2;
	const cell_width = Math.floor(available_board_width / columns);
	const cell_height = Math.floor(available_height / rows);

	return Math.max(min_cell_size, Math.min(cell_width, cell_height));
}

function getWelcomeTransition() {
	const welcome_element = document.querySelector(".welcome") as HTMLElement | null;
	const sample_element = document.querySelector("#sample") as HTMLElement | null;
	if (!welcome_element || !sample_element) {
		return {
			translateX: 0,
			translateY: 0,
			scale: 0.18
		};
	}

	const welcome_rect = welcome_element.getBoundingClientRect();
	const sample_rect = sample_element.getBoundingClientRect();
	const target_width = Math.min(sample_rect.width, cell_size * 8);
	const target_height = cell_size * 6;
	const scale = Math.max(0.08, Math.min(target_width / welcome_rect.width, target_height / welcome_rect.height));
	const welcome_center_x = welcome_rect.left + welcome_rect.width / 2;
	const welcome_center_y = welcome_rect.top + welcome_rect.height / 2;
	const sample_center_x = sample_rect.left + sample_rect.width / 2;
	const sample_intro_center_y = sample_rect.top + target_height / 2 + 8;

	return {
		translateX: sample_center_x - welcome_center_x,
		translateY: sample_intro_center_y - welcome_center_y,
		scale
	};
}

onUnmounted(() => {
	game?.end();
});
</script>

<style scoped>
main {
	--page-padding: 16px;
	--layout-gap: 24px;
	display: grid;
	grid-template-columns: minmax(180px, 1fr) var(--board-width) minmax(180px, 1fr);
	gap: var(--layout-gap);
	height: 100%;
	width: 100%;
	overflow: hidden;
	background-color: #1e293b;
	text-align: center;
	padding: var(--page-padding);
	box-sizing: border-box;
	position: relative;

	.left-panel,
	.sample-panel,
	.board-panel {
		min-width: 0;
		min-height: 0;
	}

	.left-panel {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		overflow: hidden;
	}

	.left-panel-content {
		width: min(100%, max(320px, var(--next-panel-width)));
		max-height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: clamp(12px, 2vh, 24px);
		overflow: auto;
		padding-right: clamp(0px, 1vw, 12px);
		box-sizing: border-box;
	}

	.board-panel {
		width: var(--board-width);
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.game {
		display: flex;
		width: var(--board-width);
		height: var(--board-height);
		text-align: center;
		justify-content: center;
		align-items: center;
	}

	.game-controller {
		width: 100%;
		position: relative;
	}

	.next-panel {
		display: flex;
		justify-content: center;
		min-width: 0;
	}

	.sample-panel {
		display: flex;
		align-items: flex-start;
		justify-content: flex-start;
		overflow: auto;
		padding-left: clamp(0px, 1vw, 12px);
		padding-block: 12px;
		box-sizing: border-box;
	}

	#next {
		display: inline-block;
		max-width: 100%;
		overflow: hidden;
		border: 2px dashed rgba(226, 232, 240, 0.45);
		border-radius: 8px;
		padding: 8px;
		box-sizing: border-box;
	}

	.game-sample {
		min-width: 100%;
	}
}

@media (max-height: 760px) {
	main {
		--layout-gap: 16px;
	}

	main .left-panel-content {
		gap: 10px;
	}
}

.bug-feedback-button {
	position: absolute;
	top: 20px;
	left: 20px;
	z-index: 20;
	border: 0;
	border-radius: 999px;
	padding: 10px 16px;
	background: linear-gradient(135deg, #ea580c 0%, #fb7185 100%);
	color: white;
	font-weight: 700;
	cursor: pointer;
	box-shadow: 0 12px 30px rgba(234, 88, 12, 0.28);
}

.welcome {
	position: absolute;
	top: 0;
	left: 0;
}
</style>
