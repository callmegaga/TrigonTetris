<template>
	<main class="admin-page">
		<header class="admin-header">
			<div>
				<h1>BUG 反馈后台</h1>
				<p>输入管理员密钥后查看反馈列表、详情和现场恢复入口。</p>
			</div>
			<div class="auth-box">
				<input v-model="adminKey" type="password" placeholder="管理员密钥" @keydown.enter="loadReports" />
				<button type="button" @click="loadReports" :disabled="loading">
					{{ loading ? "加载中..." : "加载反馈" }}
				</button>
			</div>
		</header>

		<p v-if="errorMessage" class="error-banner">{{ errorMessage }}</p>

		<section class="admin-layout">
			<div class="report-list-panel">
				<div class="panel-title-row">
					<h2>反馈列表</h2>
					<button type="button" class="ghost-button" @click="loadReports" :disabled="loading || !adminKey">刷新</button>
				</div>

				<ul class="report-list">
					<li
						v-for="report in reports"
						:key="report.id"
						:class="['report-item', { active: report.id === selectedReport?.id }]"
						@click="selectReport(report.id)"
					>
						<div class="report-item-header">
							<strong>{{ report.id }}</strong>
							<span class="status-chip" :data-status="report.status">{{ report.status }}</span>
						</div>
						<p>{{ report.description || "无描述" }}</p>
						<div class="report-meta">
							<span>{{ report.snapshot.gameStatus }}</span>
							<span>分数 {{ report.snapshot.score }}</span>
							<span>{{ formatDate(report.createdAt) }}</span>
						</div>
					</li>
					<li v-if="!reports.length" class="report-empty">暂无反馈数据</li>
				</ul>
			</div>

			<div class="report-detail-panel">
				<div v-if="selectedReport" class="detail-content">
					<div class="panel-title-row">
						<h2>反馈详情</h2>
						<select v-model="editableStatus" @change="updateStatus" :disabled="statusUpdating">
							<option value="new">new</option>
							<option value="processing">processing</option>
							<option value="resolved">resolved</option>
						</select>
					</div>

					<div class="detail-primary-layout">
						<div class="detail-column">
							<div class="detail-block">
								<div class="detail-label">描述</div>
								<p>{{ selectedReport.description || "玩家未填写描述" }}</p>
							</div>

							<div class="detail-grid">
								<div class="detail-block">
									<div class="detail-label">提交时间</div>
									<p>{{ formatDate(selectedReport.createdAt) }}</p>
								</div>
								<div class="detail-block">
									<div class="detail-label">游戏状态</div>
									<p>{{ selectedReport.snapshot.gameStatus }}</p>
								</div>
								<div class="detail-block">
									<div class="detail-label">当前分数</div>
									<p>{{ selectedReport.snapshot.score }}</p>
								</div>
								<div class="detail-block">
									<div class="detail-label">历史最高</div>
									<p>{{ selectedReport.snapshot.maxScore }}</p>
								</div>
							</div>

							<div class="detail-block snapshot-card">
								<div class="snapshot-card-header">
									<div>
										<div class="detail-label">现场快照 JSON</div>
										<p class="snapshot-hint">默认收起，需要时展开查看，内容区域内部滚动。</p>
									</div>
									<button type="button" class="ghost-button" @click="isSnapshotExpanded = !isSnapshotExpanded">
										{{ isSnapshotExpanded ? "收起" : "展开" }}
									</button>
								</div>
								<div v-if="isSnapshotExpanded" class="snapshot-json-wrapper">
									<pre class="snapshot-json">{{ JSON.stringify(selectedReport.snapshot, null, 2) }}</pre>
								</div>
							</div>
						</div>

						<div v-if="selectedReport.screenshotPath && screenshotObjectUrl" class="detail-column">
							<div class="detail-block screenshot-card">
								<div class="detail-label">截图</div>
								<div class="report-image-frame">
									<img class="report-image" :src="screenshotObjectUrl" alt="bug screenshot" />
								</div>
							</div>
						</div>
					</div>

					<div class="detail-actions">
						<button type="button" @click="openRestoreView">恢复现场</button>
						<button type="button" class="danger-button" @click="deleteReport" :disabled="statusUpdating || deleting">
							{{ deleting ? "删除中..." : "删除反馈" }}
						</button>
					</div>
				</div>
				<div v-else class="report-empty">选择一条反馈查看详情</div>
			</div>
		</section>
	</main>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import type { FeedbackReport, FeedbackStatus } from "@/feedback/types";

const STORAGE_KEY = "bug-feedback-admin-key";
const RESTORE_KEY = "bug-feedback-restore-snapshot";

const adminKey = ref("");
const loading = ref(false);
const statusUpdating = ref(false);
const deleting = ref(false);
const errorMessage = ref("");
const reports = ref<FeedbackReport[]>([]);
const selectedReport = ref<FeedbackReport | null>(null);
const editableStatus = ref<FeedbackStatus>("new");
const screenshotObjectUrl = ref("");
const isSnapshotExpanded = ref(false);

watch(selectedReport, (value) => {
	editableStatus.value = value?.status ?? "new";
	isSnapshotExpanded.value = false;
});

async function loadReports() {
	if (!adminKey.value) {
		errorMessage.value = "请输入管理员密钥。";
		return;
	}

	loading.value = true;
	errorMessage.value = "";

	try {
		const response = await fetch("/api/admin/feedbacks", {
			headers: {
				"x-admin-key": adminKey.value
			}
		});
		if (!response.ok) {
			throw new Error(await response.text());
		}
		const data = (await response.json()) as FeedbackReport[];
		reports.value = data;
		sessionStorage.setItem(STORAGE_KEY, adminKey.value);
		if (!data.length) {
			revokeScreenshotUrl();
			selectedReport.value = null;
			return;
		}

		if (!selectedReport.value) {
			selectedReport.value = data[0];
			await loadScreenshot();
			return;
		}

		const updatedSelection = data.find((item) => item.id === selectedReport.value?.id);
		selectedReport.value = updatedSelection ?? data[0];
		await loadScreenshot();
	} catch (error) {
		console.error(error);
		errorMessage.value = error instanceof Error ? error.message : "加载反馈失败";
	} finally {
		loading.value = false;
	}
}

async function selectReport(id: string) {
	if (!adminKey.value) return;
	errorMessage.value = "";

	try {
		const response = await fetch(`/api/admin/feedback?id=${encodeURIComponent(id)}`, {
			headers: {
				"x-admin-key": adminKey.value
			}
		});
		if (!response.ok) {
			throw new Error(await response.text());
		}
		selectedReport.value = (await response.json()) as FeedbackReport;
		await loadScreenshot();
	} catch (error) {
		console.error(error);
		errorMessage.value = error instanceof Error ? error.message : "加载反馈详情失败";
	}
}

async function updateStatus() {
	if (!selectedReport.value || !adminKey.value) return;

	statusUpdating.value = true;
	errorMessage.value = "";

	try {
		const response = await fetch(`/api/admin/feedback?id=${encodeURIComponent(selectedReport.value.id)}`, {
			method: "PATCH",
			headers: {
				"content-type": "application/json",
				"x-admin-key": adminKey.value
			},
			body: JSON.stringify({
				status: editableStatus.value
			})
		});
		if (!response.ok) {
			throw new Error(await response.text());
		}
		selectedReport.value = (await response.json()) as FeedbackReport;
		reports.value = reports.value.map((report) => (report.id === selectedReport.value?.id ? selectedReport.value : report));
	} catch (error) {
		console.error(error);
		errorMessage.value = error instanceof Error ? error.message : "更新状态失败";
	} finally {
		statusUpdating.value = false;
	}
}

function openRestoreView() {
	if (!selectedReport.value) return;
	localStorage.setItem(RESTORE_KEY, JSON.stringify(selectedReport.value.snapshot));
	window.open("/restore.html", "_blank");
}

function formatDate(value: string) {
	return new Date(value).toLocaleString();
}

async function loadScreenshot() {
	revokeScreenshotUrl();
	if (!selectedReport.value?.screenshotPath || !adminKey.value) {
		return;
	}

	const response = await fetch(`/api/admin/blob?pathname=${encodeURIComponent(selectedReport.value.screenshotPath)}`, {
		headers: {
			"x-admin-key": adminKey.value
		}
	});
	if (!response.ok) {
		throw new Error(await response.text());
	}

	const blob = await response.blob();
	screenshotObjectUrl.value = URL.createObjectURL(blob);
}

function revokeScreenshotUrl() {
	if (!screenshotObjectUrl.value) return;
	URL.revokeObjectURL(screenshotObjectUrl.value);
	screenshotObjectUrl.value = "";
}

async function deleteReport() {
	if (!selectedReport.value || !adminKey.value) return;

	const targetId = selectedReport.value.id;
	if (!window.confirm(`确认删除反馈 ${targetId}？此操作不可撤销。`)) {
		return;
	}

	deleting.value = true;
	errorMessage.value = "";

	try {
		const response = await fetch(`/api/admin/feedback?id=${encodeURIComponent(targetId)}`, {
			method: "DELETE",
			headers: {
				"x-admin-key": adminKey.value
			}
		});
		if (!response.ok) {
			throw new Error(await response.text());
		}

		reports.value = reports.value.filter((report) => report.id !== targetId);
		revokeScreenshotUrl();
		selectedReport.value = reports.value[0] ?? null;
		if (selectedReport.value) {
			await loadScreenshot();
		}
	} catch (error) {
		console.error(error);
		errorMessage.value = error instanceof Error ? error.message : "删除反馈失败";
	} finally {
		deleting.value = false;
	}
}

onMounted(() => {
	const storedKey = sessionStorage.getItem(STORAGE_KEY);
	if (!storedKey) return;
	adminKey.value = storedKey;
	void loadReports();
});

onBeforeUnmount(() => {
	revokeScreenshotUrl();
});
</script>

<style scoped>
.admin-page {
	height: 100%;
	background: linear-gradient(180deg, #0f172a 0%, #111827 100%);
	color: #e5eef9;
	padding: 24px;
	box-sizing: border-box;
	overflow: hidden;
	display: flex;
	flex-direction: column;
}

.admin-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	gap: 16px;
	margin-bottom: 24px;
}

.admin-header h1 {
	margin: 0 0 8px;
	font-size: 32px;
}

.admin-header p {
	margin: 0;
	color: #b6c3d6;
}

.auth-box {
	display: flex;
	gap: 12px;
}

.auth-box input,
.auth-box button,
.detail-actions button,
.panel-title-row select {
	border-radius: 12px;
	border: 1px solid rgba(148, 163, 184, 0.3);
	padding: 10px 14px;
	font-size: 14px;
}

.auth-box input,
.panel-title-row select {
	background: rgba(15, 23, 42, 0.85);
	color: #e5eef9;
}

.auth-box button,
.detail-actions button {
	background: #ea580c;
	color: white;
	cursor: pointer;
}

.admin-layout {
	display: grid;
	grid-template-columns: 340px minmax(0, 1fr);
	gap: 24px;
	flex: 1;
	min-height: 0;
}

.report-list-panel,
.report-detail-panel {
	background: rgba(15, 23, 42, 0.76);
	border: 1px solid rgba(148, 163, 184, 0.24);
	border-radius: 20px;
	padding: 20px;
	box-sizing: border-box;
	min-height: 0;
	overflow: hidden;
}

.panel-title-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 12px;
	margin-bottom: 16px;
}

.panel-title-row h2 {
	margin: 0;
}

.report-list {
	list-style: none;
	padding: 0;
	margin: 0;
	display: flex;
	flex-direction: column;
	gap: 12px;
	overflow: auto;
	max-height: 100%;
}

.report-item,
.report-empty {
	background: rgba(30, 41, 59, 0.84);
	border: 1px solid transparent;
	border-radius: 14px;
	padding: 14px;
}

.report-item {
	cursor: pointer;
}

.report-item.active {
	border-color: #f97316;
}

.report-item-header,
.report-meta {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 8px;
}

.report-item p {
	margin: 10px 0;
	color: #dbe7f5;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

.report-meta {
	font-size: 12px;
	color: #9fb0c7;
}

.status-chip {
	padding: 4px 8px;
	border-radius: 999px;
	font-size: 12px;
	background: rgba(148, 163, 184, 0.2);
}

.status-chip[data-status="new"] {
	background: rgba(59, 130, 246, 0.24);
}

.status-chip[data-status="processing"] {
	background: rgba(245, 158, 11, 0.24);
}

.status-chip[data-status="resolved"] {
	background: rgba(34, 197, 94, 0.24);
}

.detail-content {
	display: flex;
	flex-direction: column;
	gap: 16px;
	height: 100%;
	min-height: 0;
	overflow: hidden;
}

.detail-primary-layout {
	display: grid;
	grid-template-columns: minmax(0, 1fr) 320px;
	gap: 16px;
	align-items: start;
	min-height: 0;
	flex: 1;
}

.detail-column {
	display: flex;
	flex-direction: column;
	gap: 16px;
	min-height: 0;
}

.detail-grid {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 12px;
}

.detail-block {
	background: rgba(30, 41, 59, 0.84);
	border-radius: 14px;
	padding: 14px;
}

.detail-block p {
	margin: 8px 0 0;
	color: #dbe7f5;
}

.detail-label {
	color: #9fb0c7;
	font-size: 13px;
}

.detail-actions {
	display: flex;
	justify-content: flex-end;
	gap: 12px;
	flex-wrap: wrap;
}

.snapshot-card {
	min-height: 0;
	display: flex;
	flex-direction: column;
}

.snapshot-card-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	gap: 16px;
}

.snapshot-hint {
	margin: 8px 0 0;
	font-size: 12px;
	color: #9fb0c7;
}

.snapshot-json-wrapper {
	margin-top: 12px;
	min-height: 0;
	flex: 1;
}

.report-image-frame {
	margin-top: 12px;
	border-radius: 14px;
	background: #020617;
	padding: 12px;
	display: flex;
	justify-content: center;
	align-items: center;
	min-height: 420px;
	flex: 1;
}

.report-image {
	display: block;
	width: 100%;
	max-width: 220px;
	max-height: 520px;
	object-fit: contain;
	border-radius: 12px;
}

.snapshot-json {
	margin: 0;
	background: #020617;
	border-radius: 14px;
	padding: 16px;
	overflow: auto;
	height: 340px;
	color: #bfdbfe;
	font-size: 12px;
	line-height: 1.5;
}

.ghost-button {
	border: 1px solid rgba(148, 163, 184, 0.4);
	background: transparent;
	color: #e5eef9;
	border-radius: 999px;
	padding: 8px 14px;
	cursor: pointer;
}

.danger-button {
	background: #b91c1c;
}

.error-banner {
	background: rgba(127, 29, 29, 0.5);
	border: 1px solid rgba(248, 113, 113, 0.4);
	border-radius: 14px;
	padding: 12px 14px;
	margin: 0 0 16px;
}

@media (max-width: 1080px) {
	.admin-header,
	.admin-layout {
		grid-template-columns: 1fr;
		display: grid;
	}

	.auth-box {
		flex-direction: column;
	}

	.detail-grid {
		grid-template-columns: 1fr;
	}

	.detail-primary-layout {
		grid-template-columns: 1fr;
	}

	.admin-page {
		overflow: auto;
		height: auto;
	}
}
</style>
