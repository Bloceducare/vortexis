import axios from "axios";

/**
 * Normalised API error. `fieldErrors` maps a backend field name to a single
 * user-facing message so forms can render it next to the right input.
 */
export class ApiError extends Error {
  status?: number;
  fieldErrors: Record<string, string>;

  constructor(message: string, fieldErrors: Record<string, string> = {}, status?: number) {
    super(message);
    this.name = "ApiError";
    this.fieldErrors = fieldErrors;
    this.status = status;
  }
}

const GENERIC_KEYS = new Set(["message", "detail", "error", "errors", "non_field_errors", "status", "code"]);

const toMessage = (value: unknown): string | undefined => {
  if (value == null) return undefined;
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return toMessage(value[0]);
  if (typeof value === "object") {
    const first = Object.values(value as Record<string, unknown>)[0];
    return toMessage(first);
  }
  return String(value);
};

const collectFieldErrors = (source: unknown): Record<string, string> => {
  const out: Record<string, string> = {};
  if (!source || typeof source !== "object" || Array.isArray(source)) return out;
  for (const [key, value] of Object.entries(source as Record<string, unknown>)) {
    if (GENERIC_KEYS.has(key)) continue;
    const msg = toMessage(value);
    if (msg) out[key] = msg;
  }
  return out;
};

/**
 * Converts anything thrown by axios (DRF validation errors, our `{message, errors}`
 * shape, network failures, 5xx) into an ApiError with a readable message.
 */
export function parseApiError(error: unknown, fallback = "Something went wrong. Please try again."): ApiError {
  if (error instanceof ApiError) return error;

  if (axios.isCancel(error)) {
    return new ApiError("Your session has expired. Please log in again and retry.");
  }

  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data as any;

    if (!error.response) {
      return new ApiError(
        "Could not reach the server. Check your internet connection and try again.",
        {},
        undefined,
      );
    }

    // Field errors may be top-level (raw DRF) or nested under `errors` (our shape).
    const fieldErrors = {
      ...collectFieldErrors(data),
      ...collectFieldErrors(data?.errors),
    };

    const nonField =
      toMessage(data?.non_field_errors) || toMessage(data?.errors?.non_field_errors);

    let message =
      (typeof data?.message === "string" && data.message) ||
      nonField ||
      (typeof data?.detail === "string" && data.detail) ||
      (typeof data?.error === "string" && data.error) ||
      Object.values(fieldErrors)[0];

    if (!message) {
      if (status === 401) message = "You need to be logged in to do this.";
      else if (status === 403) message = "You don't have permission to do this.";
      else if (status === 404) message = "The requested resource was not found.";
      else if (status === 429) message = "Too many requests. Please wait a moment and try again.";
      else if (status && status >= 500) message = "The server ran into a problem. Please try again shortly.";
      else message = fallback;
    }

    // Keep non-field errors visible even if `message` was a summary.
    if (nonField && nonField !== message) fieldErrors.non_field_errors = nonField;

    return new ApiError(message, fieldErrors, status);
  }

  if (error instanceof Error && error.message) return new ApiError(error.message);
  return new ApiError(fallback);
}
