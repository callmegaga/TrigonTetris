<template>
	<main>
		<div class="controller-and-score">
			<game-score :score="score" :max-score="max_score" />
			<!--			<game-pad class="gamepad" />-->
			<!--			<button @click="game.stop()">STOP</button>-->
			<game-keyboard class="game-controller" />
		</div>
		<div class="game" id="game"></div>
		<div class="next-and-sample">
			<div id="next"></div>
			<game-sample-canvas class="game-sample" />
		</div>
	</main>
	<the-welcome v-if="is_show_welcome" @click="startGame" class="welcome" />
	<game-over v-if="is_game_over" />
	<score-tooltip :score="new_score" :left="new_score_left" :top="new_score_top" />
</template>

<script setup lang="ts">
import TheWelcome from "@/components/TheWelcome.vue";
import { Game, ScoreType } from "@/game/game";
import { onMounted, onUnmounted, ref } from "vue";
import GameSampleCanvas from "@/components/GameSampleCanvas.vue";
import GameScore from "@/components/GameScore.vue";
import { ACTIVE_BOARD_ROWS, GAME_BOARD_COL, GAME_BOARD_ROW } from "@/game/config";
import { getElementScreenPosition, getHistoryMaxScore, getSquareCenterPixelPosition, setHistoryMaxScore } from "@/utils/utils";
import GameOver from "@/components/GameOver.vue";
import ScoreTooltip from "@/components/ScoreTooltip.vue";
import type { BevelledSquare, NormalSquare } from "@/game/types";
import GameKeyboard from "@/components/GameKeyboard.vue";
import { audioManager, SoundEffect } from "@/utils/audio_manager";

const is_show_welcome = ref(true);
const is_game_over = ref(false);
const score = ref(0);
const new_score = ref(0);
const max_score = ref(0);
const new_score_top = ref(100);
const new_score_left = ref(100);

let game: Game;

function startGame() {
	is_show_welcome.value = false;
	game.start();
}

let cell_size = getCellSize(window.innerWidth, window.innerHeight, GAME_BOARD_COL, GAME_BOARD_ROW + ACTIVE_BOARD_ROWS);

window.document.addEventListener("click", () => {});

function onScore(gain: number, square: NormalSquare | BevelledSquare, type: ScoreType) {
	if (gain === 0) {
		return;
	}
	console.log(square);
	console.log("score", gain);
	const square_center_position = getSquareCenterPixelPosition(square, cell_size);
	const element_position = getElementScreenPosition(document.querySelector("#game canvas") as HTMLElement);
	console.log(element_position);
	console.log(square_center_position);

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
	console.log("fail");
	is_game_over.value = true;
	game.end();
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

function getCellSize(dom_width: number, dom_height: number, columns: number, rows: number) {
	const cell_width = Math.floor(dom_width / columns);
	const cell_height = Math.floor((dom_height - 10) / rows);
	const cell_size = Math.min(cell_width, cell_height);
	console.log(cell_size);
	return cell_size;
}

onUnmounted(() => {
	game.end();
});
</script>

<style scoped>
main {
	display: flex;
	height: 100%;
	width: 100%;
	overflow: hidden;
	background-color: #1e293b;
	text-align: center;
	justify-content: center;

	.game {
		display: flex;
		text-align: center;
		justify-content: center;
		align-items: center;
	}

	.controller-and-score {
		width: 200px;
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		padding-right: 32px;
		align-items: self-end;

		.game-controller {
			width: 100%;
			position: relative;
		}
	}

	.next-and-sample {
		text-align: center;
		width: 25%;
		padding-left: 32px;
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		align-items: self-start;
	}

	#next {
		display: inline-block;
		border: 5px dashed #ddd;
		padding: 10px;
	}

	.samples-container {
		display: flex;
		flex-direction: column;
		gap: 20px;
		width: 100%;
	}

	.game-sample {
		width: 100%;
	}
}

.welcome {
	position: absolute;
	top: 0;
	left: 0;
}
</style>
