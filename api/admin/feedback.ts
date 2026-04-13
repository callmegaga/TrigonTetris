import type { FeedbackStatus } from "../../src/feedback/types";
import { deleteFeedbackReport, getFeedbackReport, updateFeedbackStatus } from "../_lib/feedback-store";

export async function GET(request: Request) {
	const authError = ensureAdmin(request);
	if (authError) {
		return authError;
	}

	const id = new URL(request.url).searchParams.get("id");
	if (!id) {
		return new Response("缺少反馈 ID。", { status: 400 });
	}

	try {
		const report = await getFeedbackReport(id);
		if (!report) {
			return new Response("反馈不存在。", { status: 404 });
		}
		return Response.json(report);
	} catch (error) {
		console.error("get feedback failed", error);
		return new Response("读取反馈详情失败。", { status: 500 });
	}
}

export async function PATCH(request: Request) {
	const authError = ensureAdmin(request);
	if (authError) {
		return authError;
	}

	const id = new URL(request.url).searchParams.get("id");
	if (!id) {
		return new Response("缺少反馈 ID。", { status: 400 });
	}

	let body: { status?: FeedbackStatus };
	try {
		body = (await request.json()) as { status?: FeedbackStatus };
	} catch {
		return new Response("请求体格式不正确。", { status: 400 });
	}

	if (!body.status || !["new", "processing", "resolved"].includes(body.status)) {
		return new Response("非法状态值。", { status: 400 });
	}

	try {
		const report = await updateFeedbackStatus(id, body.status);
		if (!report) {
			return new Response("反馈不存在。", { status: 404 });
		}
		return Response.json(report);
	} catch (error) {
		console.error("update feedback failed", error);
		return new Response("更新反馈状态失败。", { status: 500 });
	}
}

export async function DELETE(request: Request) {
	const authError = ensureAdmin(request);
	if (authError) {
		return authError;
	}

	const id = new URL(request.url).searchParams.get("id");
	if (!id) {
		return new Response("缺少反馈 ID。", { status: 400 });
	}

	try {
		const report = await deleteFeedbackReport(id);
		if (!report) {
			return new Response("反馈不存在。", { status: 404 });
		}
		return Response.json({
			id: report.id,
			deleted: true
		});
	} catch (error) {
		console.error("delete feedback failed", error);
		return new Response("删除反馈失败。", { status: 500 });
	}
}

function ensureAdmin(request: Request) {
	const expectedKey = process.env.BUG_FEEDBACK_ADMIN_KEY;
	if (!expectedKey) {
		return new Response("BUG_FEEDBACK_ADMIN_KEY 未配置。", { status: 500 });
	}
	if (request.headers.get("x-admin-key") !== expectedKey) {
		return new Response("管理员密钥错误。", { status: 401 });
	}
	return null;
}
