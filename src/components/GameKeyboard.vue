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
						<div class="key-description">下</div>
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
				<div class="key-container wide-key">
					<div class="key enter-key">Enter</div>
					<div class="key-description">下跳</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.keyboard-layout {
	width: 100%;
	margin: 0 auto;
	padding: 16px;
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.arrow-keys {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 16px;
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
	height: 40px;
	width: 40px;
	font-size: 16px;
}

.key-description {
	color: white;
	font-size: 12px;
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

.space-key,
.enter-key {
	font-size: 14px;
}
</style>
