import { listFeedbackReports } from "../_lib/feedback-store.js";

export async function GET(request: Request) {
	const authError = ensureAdmin(request);
	if (authError) {
		return authError;
	}

	try {
		const reports = await listFeedbackReports();
		return Response.json(reports);
	} catch (error) {
		console.error("list feedbacks failed", error);
		return new Response("读取反馈列表失败。", { status: 500 });
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
