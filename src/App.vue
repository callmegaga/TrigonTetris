<template>
	<main>
		<div class="controller-and-score">
<!--			<game-score :score="score" :max_score="max_score" />-->
<!--			<game-pad class="gamepad" />-->
		</div>
		<div class="game" id="game"></div>
		<div class="next-and-sample">
			<div id="next"></div>
<!--			<game-sample class="game-sample" />-->
		</div>
	</main>
	<the-welcome v-if="is_show_welcome" @click="startGame" class="welcome" />
	<game-over v-if="is_game_over" />
</template>

<script setup lang="ts">
import TheWelcome from "@/components/TheWelcome.vue";
import { Game } from "@/game/game";
import { onMounted, onUnmounted, ref } from "vue";
import GameSample from "@/components/GameSample.vue";
import GamePad from "@/components/GamePad.vue";
import GameScore from "@/components/GameScore.vue";
import { GAME_BOARD_CELL_SIZE, GAME_BOARD_COL, GAME_BOARD_ROW } from "@/game/config";
import { getHistoryMaxScore, setHistoryMaxScore } from "@/utils/utils";
import GameOver from "@/components/GameOver.vue";

const is_show_welcome = ref(true);
const is_game_over = ref(false);
const score = ref(0);
const max_score = ref(0);
const cheer_audio = new Audio("/audio/cheer.mp3");
const shooo_audio = new Audio("/audio/shooo.mp3");

let game: Game;

function startGame() {
	is_show_welcome.value = false;
	game.start();
}

window.document.addEventListener("click", () => {
});

function onScore(gain: number) {
	console.log("score", gain);
	score.value += gain;
	cheer_audio.play();
	setTimeout(() => {
		shooo_audio.play();
	}, 5000);
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
		board_cell_size: GAME_BOARD_CELL_SIZE,
		onScore: onScore,
		onFail: onFail,
		next_container: document.querySelector("#next") as HTMLElement
	});
});

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

	.game {
		display: flex;
		text-align: center;
		flex: 1;
		justify-content: center;
		align-items: center;
	}

	.controller-and-score {
		width: 400px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		.gamepad {
			height: 300px;
		}
	}

	.next-and-sample {
		text-align: center;
		width: 25%;
	}

	#next {
		display: inline-block;
		border: 5px dashed #ddd;
		padding: 10px;
	}
}

.welcome {
	position: absolute;
	top: 0;
	left: 0;
}
</style>
