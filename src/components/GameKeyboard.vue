<template>
	<div>
		<div class="keyboard-layout">
			<!-- 方向键区域 -->
			<div class="arrow-keys">
				<div class="arrow-grid">
					<div class="key-container up-key">
						<div class="key">↑</div>
						<div class="key-description">旋转</div>
					</div>
					<div class="key-container left-key">
						<div class="key">←</div>
						<div class="key-description">左</div>
					</div>
					<div class="key-container down-key">
						<div class="key">↓</div>
						<div class="key-description">下跳</div>
					</div>
					<div class="key-container right-key">
						<div class="key">→</div>
						<div class="key-description">右</div>
					</div>
				</div>
			</div>

			<!-- 功能键区域 -->
			<div class="function-keys">
				<div class="key-container wide-key">
					<div class="key space-key">Space</div>
					<div class="key-description">对翻</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.keyboard-layout {
	width: 100%;
	margin: 0 auto;
	padding: 0;
	display: flex;
	flex-direction: column;
	gap: 12px;
	box-sizing: border-box;
}

.arrow-keys {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.arrow-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-template-rows: repeat(2, auto);
	gap: 4px;
}

.key-container {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.key {
	background-color: #4b5563;
	color: white;
	border: 1px solid #374151;
	border-radius: 4px;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	height: clamp(32px, 4.6vh, 40px);
	width: clamp(32px, 4.6vh, 40px);
	font-size: clamp(13px, 1.2vw, 16px);
}

.key-description {
	color: white;
	font-size: clamp(10px, 0.9vw, 12px);
	margin-top: 4px;
	text-align: center;
}

.up-key {
	grid-column: 2;
	grid-row: 1;
}

.left-key {
	grid-column: 1;
	grid-row: 2;
}

.down-key {
	grid-column: 2;
	grid-row: 2;
}

.right-key {
	grid-column: 3;
	grid-row: 2;
}

.function-keys {
	display: flex;
	justify-content: center;
	gap: 16px;
}

.wide-key .key {
	padding: 8px 16px;
	height: auto;
}

.space-key {
	font-size: 14px;
}
</style>
