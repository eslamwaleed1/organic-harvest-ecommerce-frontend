const API_BASE_URL = (
	import.meta.env.DEV
		? import.meta.env.VITE_API_URL || "http://localhost:5000"
		: window.location.origin
).trim().replace(/\/+$/, "");

function getApiUrl(path) {
	let backendUrl;
	try {
		backendUrl = new URL(API_BASE_URL);
	} catch {
		throw new Error(
			"VITE_API_URL must be an absolute backend origin, such as http://localhost:5000.",
		);
	}

	if (
		!["http:", "https:"].includes(backendUrl.protocol) ||
		backendUrl.pathname !== "/" ||
		backendUrl.search ||
		backendUrl.hash
	) {
		throw new Error(
			"VITE_API_URL must contain only the backend origin, without a path.",
		);
	}

	return new URL(path.replace(/^\/+/, ""), backendUrl.origin).toString();
}

function getErrorMessage(payload, status) {
	if (typeof payload === "string" && payload) return payload;
	return payload?.message || payload?.error || `Request failed (${status}).`;
}

export async function apiRequest(path, options = {}) {
	const url = getApiUrl(path);
	const headers = new Headers(options.headers);

	if (options.body && !headers.has("Content-Type")) {
		headers.set("Content-Type", "application/json");
	}

	let response;
	try {
		response = await fetch(url, {
			...options,
			headers,
			credentials: "include",
		});
	} catch {
		throw new Error(
			`Could not reach the backend at ${API_BASE_URL}. Check the URL, backend status, and CORS settings.`,
		);
	}

	const text = await response.text();
	let payload = null;
	if (text) {
		try {
			payload = JSON.parse(text);
		} catch {
			payload = text;
		}
	}

	if (!response.ok) {
		const error = new Error(getErrorMessage(payload, response.status));
		error.status = response.status;
		error.code = payload?.code;
		throw error;
	}

	return payload;
}

const jsonRequest = (path, method, payload) =>
	apiRequest(path, {
		method,
		body: JSON.stringify(payload),
	});

export const authApi = {
	login: (payload) => jsonRequest("/api/auth/login", "POST", payload),
	me: () => apiRequest("/api/auth/me"),
	forgotPassword: (payload) => jsonRequest("/api/auth/forgot-password", "POST", payload),
	resetPassword: (payload) => jsonRequest("/api/auth/reset-password", "POST", payload),
	changePassword: () => apiRequest("/api/auth/change-password", { method: "POST" }),
	logout: () => apiRequest("/api/auth/logout", { method: "POST" }),
	signup: (payload) => jsonRequest("/api/auth/signup", "POST", payload),
	resendMagicLink: (payload) =>
		jsonRequest("/api/auth/resend-magic-link", "POST", payload),
	verifyEmail: (payload) =>
		jsonRequest("/api/auth/verify-email", "POST", payload),
	registerAdmin: (payload) =>
		jsonRequest("/api/auth/register-admin", "POST", payload),
	google: (payload) => jsonRequest("/api/auth/google", "POST", payload),
	adminInvitation: (payload) =>
		jsonRequest("/api/auth/admin/invitations", "POST", payload),
	setAdminPassword: (payload) =>
		jsonRequest("/api/auth/admin/set-password", "POST", payload),
};

export const userApi = {
	profile: () => apiRequest("/api/users/profile"),
	updateProfile: (payload) => jsonRequest("/api/users/profile", "PATCH", payload),
};

export const feedbackApi = {
	submitSuggestion: (text) =>
		jsonRequest("/api/suggestions", "POST", { text }),
	submitEnquiry: (question) =>
		jsonRequest("/api/enquiries", "POST", { question }),
	enquiries: () => apiRequest("/api/enquiries"),
};

export const adminApi = {
	summary: () => apiRequest("/api/admin/reports/summary"),
	users: () => apiRequest("/api/users"),
	products: () => apiRequest("/api/products/"),
	createProduct: (payload) => jsonRequest("/api/products/new", "POST", payload),
	updateProduct: (id, payload) => jsonRequest(`/api/products/${id}`, "PATCH", payload),
	deleteProduct: (id) => apiRequest(`/api/products/${id}`, { method: "DELETE" }),
	orders: () => apiRequest("/api/orders"),
	deleteOrder: (id) => apiRequest(`/api/orders/${id}`, { method: "DELETE" }),
	enquiries: () => apiRequest("/api/enquiries/all"),
	updateEnquiryAnswer: (id, answer) =>
		jsonRequest(`/api/enquiries/${id}/answer`, "PATCH", { answer }),
	suggestions: () => apiRequest("/api/suggestions"),
};

export const api = {
	users: () => apiRequest("/api/users"),
	products: () => apiRequest("/api/products/"),
	categories: () => apiRequest("/api/products/categories"),
	orders: () => apiRequest("/api/orders"),
	userOrders: () => apiRequest("/api/users/orders"),
};

export function createResource(resource, payload) {
	return jsonRequest(`/${resource}`, "POST", payload);
}

export function updateResource(resource, id, payload) {
	return jsonRequest(`/${resource}/${id}`, "PUT", payload);
}

export function deleteResource(resource, id) {
	return apiRequest(`/${resource}/${id}`, { method: "DELETE" });
}
