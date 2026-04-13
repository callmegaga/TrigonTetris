import { get } from "@vercel/blob";

export async function GET(request: Request) {
	const authError = ensureAdmin(request);
	if (authError) {
		return authError;
	}

	const pathname = new URL(request.url).searchParams.get("pathname");
	if (!pathname) {
		return new Response("缺少 blob pathname。", { status: 400 });
	}

	try {
		const result = await get(pathname, {
			access: "private",
			ifNoneMatch: request.headers.get("if-none-match") ?? undefined
		});

		if (!result) {
			return new Response("Blob 不存在。", { status: 404 });
		}

		if (result.statusCode === 304) {
			return new Response(null, {
				status: 304,
				headers: {
					ETag: result.blob.etag,
					"Cache-Control": "private, no-cache"
				}
			});
		}

		return new Response(result.stream, {
			headers: {
				"Content-Type": result.blob.contentType,
				"X-Content-Type-Options": "nosniff",
				ETag: result.blob.etag,
				"Cache-Control": "private, no-cache"
			}
		});
	} catch (error) {
		console.error("read private blob failed", error);
		return new Response("读取 Blob 失败。", { status: 500 });
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
