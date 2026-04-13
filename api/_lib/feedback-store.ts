import { del, get, list, put } from "@vercel/blob";
import type { FeedbackReport, FeedbackStatus, GameSnapshot } from "../../src/feedback/types";

const REPORT_PREFIX = "feedback/reports/";
const SCREENSHOT_PREFIX = "feedback/screenshots/";

export async function createFeedbackReport(input: {
	description: string;
	snapshot: GameSnapshot;
	screenshot: File | null;
	userAgent: string;
	pathname: string;
	referrer: string;
}) {
	const id = crypto.randomUUID();
	const createdAt = new Date().toISOString();

	let screenshotPath: string | null = null;
	if (input.screenshot) {
		const screenshotBlob = await put(`${SCREENSHOT_PREFIX}${id}.png`, input.screenshot, {
			access: "private",
			contentType: input.screenshot.type || "image/png"
		});
		screenshotPath = screenshotBlob.pathname;
	}

	const report: FeedbackReport = {
		id,
		status: "new",
		description: input.description,
		screenshotPath,
		snapshot: input.snapshot,
		createdAt,
		meta: {
			userAgent: input.userAgent,
			pathname: input.pathname,
			referrer: input.referrer
		}
	};

	await put(reportPath(id), JSON.stringify(report, null, 2), {
		access: "private",
		contentType: "application/json; charset=utf-8"
	});

	return report;
}

export async function listFeedbackReports() {
	const { blobs } = await list({
		prefix: REPORT_PREFIX
	});

	const reports = await Promise.all(blobs.map((blob) => readPrivateJson<FeedbackReport>(blob.pathname)));

	return reports.sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt));
}

export async function getFeedbackReport(id: string) {
	const { blobs } = await list({
		prefix: reportPath(id)
	});
	const blob = blobs.find((item) => item.pathname === reportPath(id));
	if (!blob) {
		return null;
	}

	return readPrivateJson<FeedbackReport>(blob.pathname);
}

export async function updateFeedbackStatus(id: string, status: FeedbackStatus) {
	const report = await getFeedbackReport(id);
	if (!report) {
		return null;
	}

	const updatedReport: FeedbackReport = {
		...report,
		status
	};

	await put(reportPath(id), JSON.stringify(updatedReport, null, 2), {
		access: "private",
		allowOverwrite: true,
		contentType: "application/json; charset=utf-8"
	});

	return updatedReport;
}

export async function deleteFeedbackReport(id: string) {
	const report = await getFeedbackReport(id);
	if (!report) {
		return null;
	}

	const deleteTargets = [reportPath(id)];
	if (report.screenshotPath) {
		deleteTargets.push(report.screenshotPath);
	}

	await del(deleteTargets);
	return report;
}

function reportPath(id: string) {
	return `${REPORT_PREFIX}${id}.json`;
}

async function readPrivateJson<T>(pathname: string): Promise<T> {
	const result = await get(pathname, { access: "private" });
	if (!result) {
		throw new Error(`Blob not found: ${pathname}`);
	}

	const text = await new Response(result.stream).text();
	return JSON.parse(text) as T;
}
