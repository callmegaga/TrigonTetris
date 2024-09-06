<template>
	<main>
		<!--		<div class="controller">-->
		<!--			<game-pad class="gamepad"/>-->
		<!--		</div>-->
		<div class="game" id="game"></div>
		<!--		<game-sample class="game-sample" />-->
	</main>
	<the-welcome v-if="is_show_welcome" @click="startGame" class="welcome" />
</template>

<script setup lang="ts">
import TheWelcome from "@/components/TheWelcome.vue";
import { Game } from "@/game/game";
import { onMounted, onUnmounted, ref } from "vue";
import GameSample from "@/components/GameSample.vue";
import GamePad from "@/components/GamePad.vue";

const is_show_welcome = ref(false);
let game: Game;

function startGame() {
	is_show_welcome.value = false;
	// game.start();
}

onMounted(() => {
	const game = new Game({
		container: document.querySelector("#game") as HTMLElement,
		columns: 10,
		rows: 20,
		block_size: 30,
	});
	game.start();
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
		flex: 1;
	}

	.controller {
		width: 500px;
		display: flex;
		flex-direction: column-reverse;

		.gamepad {
			height: 300px;
		}
	}

	.game-sample {
	}
}

.welcome {
	position: absolute;
	top: 0;
	left: 0;
}
</style>
