<template>
	<div>
		<img :src="game_sample" alt="game sample" class="sample">
	</div>
</template>

<script setup lang="ts">
import game_sample from "@/assets/game-sample.png";
</script>

<style scoped>
	.sample {
		width: 80%;
		max-width: 300px;
	}
</style>
