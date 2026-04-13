import type { GameSnapshot } from "../src/feedback/types";
import { createFeedbackReport } from "./_lib/feedback-store";

export async function POST(request: Request) {
	try {
		const formData = await request.formData();
		const description = String(formData.get("description") ?? "").trim();
		const pathname = String(formData.get("pathname") ?? "").trim();
		const snapshotRaw = formData.get("snapshot");
		const screenshot = formData.get("screenshot");

		if (!description || description.length > 100) {
			return new Response("描述不能为空，且不能超过 100 字。", { status: 400 });
		}

		if (typeof snapshotRaw !== "string") {
			return new Response("缺少游戏快照。", { status: 400 });
		}

		let snapshot: GameSnapshot;
		try {
			snapshot = JSON.parse(snapshotRaw) as GameSnapshot;
		} catch {
			return new Response("快照格式不合法。", { status: 400 });
		}

		if (!isValidSnapshot(snapshot)) {
			return new Response("快照字段不完整。", { status: 400 });
		}

		const report = await createFeedbackReport({
			description,
			snapshot,
			screenshot: screenshot instanceof File ? screenshot : null,
			userAgent: request.headers.get("user-agent") ?? "",
			pathname: pathname || "/",
			referrer: request.headers.get("referer") ?? ""
		});

		return Response.json({
			id: report.id,
			status: report.status
		});
	} catch (error) {
		console.error("feedback submit failed", error);
		return new Response("反馈保存失败，请稍后再试。", { status: 500 });
	}
}

function isValidSnapshot(snapshot: Partial<GameSnapshot> | null | undefined): snapshot is GameSnapshot {
	if (!snapshot) return false;
	if (snapshot.version !== 1) return false;
	if (!Array.isArray(snapshot.board)) return false;
	if (!Array.isArray(snapshot.nextBlocks)) return false;
	if (typeof snapshot.score !== "number" || typeof snapshot.maxScore !== "number") return false;
	if (typeof snapshot.gameStatus !== "string") return false;
	if (typeof snapshot.submittedAt !== "string") return false;
	if (!snapshot.viewport || typeof snapshot.viewport.width !== "number" || typeof snapshot.viewport.height !== "number") return false;
	return true;
}
