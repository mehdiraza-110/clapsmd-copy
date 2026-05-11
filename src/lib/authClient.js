const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

function getApiBaseUrl() {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) {
    throw new Error("Missing NEXT_PUBLIC_API_BASE_URL (or NEXT_PUBLIC_API_URL)");
  }
  return baseUrl.replace(/\/+$/, "");
}

function toErrorMessage(payload, fallback) {
  if (!payload) return fallback;
  if (typeof payload === "string") return payload;
  if (payload.message && typeof payload.message === "string") return payload.message;
  if (payload.error && typeof payload.error === "string") return payload.error;
  return fallback;
}

async function request(path, options = {}) {
  const url = `${getApiBaseUrl()}${path}`;
  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;
  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch (_error) {
    payload = null;
  }

  if (!response.ok) {
    const error = new Error(toErrorMessage(payload, `Request failed (${response.status})`));
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}

export async function login({ email, password }) {
  return request("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function register({ first_name, last_name, email, phone, password }) {
  return request("/register", {
    method: "POST",
    body: JSON.stringify({ first_name, last_name, email, phone, password }),
  });
}

export async function me(token) {
  return request("/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getActivityLogs(token, { page = 1, pageSize = 20 } = {}) {
  const query = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });

  return request(`/activity-logs?${query.toString()}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getServices(token) {
  return request("/services", {
    method: "GET",
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  });
}

export async function getServiceById(token, id) {
  return request(`/services/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function createService(token, payload) {
  return request("/services", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export async function updateService(token, id, payload) {
  return request(`/services/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export async function deleteService(token, id) {
  return request(`/services/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getSelfPayPricing(token) {
  return request("/pricing-items", {
    method: "GET",
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  });
}

export async function getVisibleSelfPayPricing() {
  return request("/pricing-items/visible", {
    method: "GET",
  });
}

export async function getSelfPayPricingById(token, id) {
  return request(`/pricing-items/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function createSelfPayPricing(token, payload) {
  return request("/pricing-items", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export async function updateSelfPayPricing(token, id, payload) {
  return request(`/pricing-items/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export async function deleteSelfPayPricing(token, id) {
  return request(`/pricing-items/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getDocumentTypes(token) {
  return request("/documents/types", {
    method: "GET",
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  });
}

export async function getPublicDocuments() {
  return request("/public/documents", {
    method: "GET",
  });
}

export async function getDocuments(token, filters = {}) {
  const query = new URLSearchParams();
  if (filters.search) query.set("search", filters.search);
  if (filters.document_type) query.set("document_type", filters.document_type);
  if (filters.visibility_status !== "" && filters.visibility_status !== undefined) {
    query.set("visibility_status", String(filters.visibility_status));
  }

  const suffix = query.toString() ? `?${query.toString()}` : "";

  return request(`/documents${suffix}`, {
    method: "GET",
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  });
}

export async function getDocumentById(token, id) {
  return request(`/documents/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function createDocument(token, payload) {
  const isFormData = typeof FormData !== "undefined" && payload instanceof FormData;
  return request("/documents", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: isFormData ? payload : JSON.stringify(payload),
  });
}

export async function updateDocument(token, id, payload) {
  const isFormData = typeof FormData !== "undefined" && payload instanceof FormData;
  return request(`/documents/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: isFormData ? payload : JSON.stringify(payload),
  });
}

export async function deleteDocument(token, id) {
  return request(`/documents/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getAnnouncements(token) {
  return request("/announcements", {
    method: "GET",
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  });
}

export async function getActiveAnnouncements() {
  return request("/announcements/active", {
    method: "GET",
  });
}

export async function getAnnouncementById(token, id) {
  return request(`/announcements/${id}`, {
    method: "GET",
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  });
}

export async function createAnnouncement(token, payload) {
  return request("/announcements", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export async function updateAnnouncement(token, id, payload) {
  return request(`/announcements/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export async function deleteAnnouncement(token, id) {
  return request(`/announcements/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getBlogs(token, options = {}) {
  return request("/blogs", {
    method: "GET",
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
    ...options,
  });
}

export async function getBlogById(token, id, options = {}) {
  return request(`/blogs/${id}`, {
    method: "GET",
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
    ...options,
  });
}

export async function createBlog(token, payload) {
  return request("/blogs", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: payload,
  });
}

export async function updateBlog(token, id, payload) {
  return request(`/blogs/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: payload,
  });
}

export async function updateBlogStatus(token, id, payload) {
  return request(`/blogs/${id}/status`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export async function deleteBlog(token, id) {
  return request(`/blogs/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getClinicHours() {
  return request("/clinic-hours", { method: "GET" });
}

export async function bulkUpdateClinicHours(token, hours) {
  return request("/clinic-hours", {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ hours }),
  });
}

export async function getDashboardStats(token) {
  return request("/dashboard/stats", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getPublishedBlogsLast6Months(token) {
  return request("/dashboard/blogs/published-last-6-months", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function setSession({ token, user }) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(TOKEN_KEY) || "";
}

export function getUser() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (_error) {
    return null;
  }
}

export function isAuthError(error) {
  return error?.status === 401;
}
