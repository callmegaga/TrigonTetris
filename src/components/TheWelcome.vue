<template>
	<div class="container">
		<video autoplay loop muted>
			<source src="/video/fish_eating.mp4" type="video/mp4" />
			您的浏览器不支持视频播放。
		</video>
	</div>
</template>

<script setup lang="ts"></script>

<style scoped>
.container {
	display: flex;
	width: 100%;
	height: 100%;
	justify-content: center;
	cursor: pointer;
	background-color: white;

	video {
		width: 100%;
		object-fit: cover;
	}
}
</style>
