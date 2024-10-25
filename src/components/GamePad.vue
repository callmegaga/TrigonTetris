<template>
	<div class="gamepad">
		<img :src="gamepad_outline" alt="gamepad" class="outline" />
		<div class="bottom-container">
			<div class="bottoms">
				<button class="top">▲</button>
				<button class="left">◀</button>
				<button class="right">▶</button>
				<button class="bottom">▼</button>
			</div>

			<div class="bottoms">
				<button class="top">▲</button>
				<button class="left">◀</button>
				<button class="right">▶</button>
				<button class="bottom">▼</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import gamepad_outline from "@/assets/gamepad-outline.png";
import type { GamePadKey } from "@/game/types";

const emits = defineEmits<{
	keydown: [GamePadKey];
}>();
</script>

<style scoped>
.gamepad {
	position: relative;

	.outline {
		width: 100%;
		height: auto;
	}

	.bottom-container {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 20px;
		left: 0;
		display: flex;
		justify-content: space-around;

		.bottoms {
			display: grid;
			width: 40%;
			height: 50%;
			grid-template-areas:
				". top ."
				"left . right"
				". bottom .";
			place-items: center;

			.top {
				grid-area: top;
			}

			.left {
				grid-area: left;
			}

			.right {
				grid-area: right;
			}

			.bottom {
				grid-area: bottom;
			}
		}
	}
}
</style>
