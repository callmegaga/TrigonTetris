<template>
<div class="game-over">
	<h1>Game Over</h1>
	<h5>Press F5 Restart Game</h5>
</div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.game-over {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: rgba(0, 0, 0, 0.5);
	flex-direction: column;

	h1 {
		color: white;
	}

	h5 {
		color: white;
	}
}
</style>
