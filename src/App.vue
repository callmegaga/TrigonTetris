<template>
	<main>
		<game-pad class="gamepad"/>
		<div class="game"></div>
		<game-sample class="game-sample" />
	</main>
	<the-welcome v-if="is_show_welcome" @click="startGame" class="welcome" />
</template>

<script setup lang="ts">
import TheWelcome from "@/components/TheWelcome.vue";
import { Game } from "@/game/game";
import { ref } from "vue";
import GameSample from "@/components/GameSample.vue";
import GamePad from "@/components/GamePad.vue";

const is_show_welcome = ref(false);

function startGame() {
	is_show_welcome.value = false;
	game.start();
}

const game = new Game({
	container: document.querySelector("main") as HTMLElement
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

	.gamepad {
		width: 500px;
		height: 200px;
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
