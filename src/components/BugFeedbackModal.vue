<template>
	<div class="feedback-overlay" @click.self="emit('close')">
		<div class="feedback-modal">
			<div class="feedback-header">
				<div>
					<h2>提交 BUG 反馈</h2>
					<p>将自动附带当前游戏现场，描述请控制在 100 字以内。</p>
				</div>
				<button type="button" class="close-button" @click="emit('close')" :disabled="submitting">×</button>
			</div>

			<textarea
				:value="description"
				class="feedback-input"
				maxlength="100"
				placeholder="例如：消除动画结束后右上角方块没有继续下落。"
				@input="onInput"
			/>

			<div class="feedback-footer">
				<span :class="['counter', { over: remaining < 0 }]">{{ description.length }}/100</span>
				<div class="actions">
					<button type="button" class="ghost-button" @click="emit('close')" :disabled="submitting">取消</button>
					<button type="button" class="submit-button" @click="emit('submit')" :disabled="submitting || !canSubmit">
						{{ submitting ? "提交中..." : "提交反馈" }}
					</button>
				</div>
			</div>

			<p v-if="message" :class="['message', { error: isError }]">{{ message }}</p>
		</div>
	</div>
</template>

<script setup lang="ts">
const props = defineProps<{
	description: string;
	submitting: boolean;
	message: string;
	isError: boolean;
	canSubmit: boolean;
	remaining: number;
}>();

const emit = defineEmits<{
	close: [];
	submit: [];
	"update:description": [value: string];
}>();

function onInput(event: Event) {
	const target = event.target as HTMLTextAreaElement;
	emit("update:description", target.value.slice(0, 100));
}
</script>

<style scoped>
.feedback-overlay {
	position: fixed;
	inset: 0;
	background: rgba(2, 6, 23, 0.72);
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 20px;
	box-sizing: border-box;
	z-index: 60;
}

.feedback-modal {
	width: min(560px, 100%);
	background: linear-gradient(180deg, #111827 0%, #0f172a 100%);
	border: 1px solid rgba(148, 163, 184, 0.24);
	border-radius: 24px;
	padding: 24px;
	color: #e5eef9;
	box-shadow: 0 20px 60px rgba(2, 6, 23, 0.45);
}

.feedback-header {
	display: flex;
	justify-content: space-between;
	gap: 16px;
	margin-bottom: 16px;
}

.feedback-header h2 {
	margin: 0 0 8px;
	font-size: 28px;
}

.feedback-header p {
	margin: 0;
	color: #a6b6ca;
}

.close-button {
	width: 40px;
	height: 40px;
	border-radius: 999px;
	border: 1px solid rgba(148, 163, 184, 0.24);
	background: transparent;
	color: #e5eef9;
	font-size: 22px;
	cursor: pointer;
}

.feedback-input {
	width: 100%;
	min-height: 140px;
	resize: vertical;
	border-radius: 16px;
	border: 1px solid rgba(148, 163, 184, 0.24);
	background: rgba(15, 23, 42, 0.92);
	color: #e5eef9;
	padding: 14px 16px;
	box-sizing: border-box;
	font: inherit;
	line-height: 1.6;
}

.feedback-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 16px;
	margin-top: 16px;
}

.counter {
	color: #9fb0c7;
	font-size: 13px;
}

.counter.over {
	color: #f87171;
}

.actions {
	display: flex;
	gap: 12px;
}

.ghost-button,
.submit-button {
	border-radius: 999px;
	padding: 10px 16px;
	border: 1px solid rgba(148, 163, 184, 0.24);
	cursor: pointer;
	font: inherit;
}

.ghost-button {
	background: transparent;
	color: #e5eef9;
}

.submit-button {
	background: #ea580c;
	color: white;
	border-color: #ea580c;
}

.message {
	margin: 16px 0 0;
	font-size: 14px;
	color: #93c5fd;
}

.message.error {
	color: #fca5a5;
}
</style>
