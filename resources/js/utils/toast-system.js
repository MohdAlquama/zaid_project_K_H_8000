import { router } from "@inertiajs/react";
import toast from "react-hot-toast";

const MUTATION_METHODS = new Set(["post", "put", "patch", "delete"]);

let inertiaToastInitialized = false;

function asMessage(value) {
  if (typeof value !== "string") {
    return null;
  }

  const cleaned = value.trim();
  return cleaned.length > 0 ? cleaned : null;
}

export function collectValidationMessages(errors) {
  if (!errors || typeof errors !== "object") {
    return [];
  }

  const messages = [];

  Object.values(errors).forEach((entry) => {
    if (Array.isArray(entry)) {
      entry.forEach((item) => {
        const msg = asMessage(item);
        if (msg) messages.push(msg);
      });
      return;
    }

    const msg = asMessage(entry);
    if (msg) messages.push(msg);
  });

  return [...new Set(messages)];
}

export function extractApiMessage(payload) {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const message = asMessage(payload.message);
  if (message) return message;

  const error = asMessage(payload.error);
  if (error) return error;

  const success = asMessage(payload.success);
  if (success) return success;

  return null;
}

export function extractErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  if (!error) {
    return fallback;
  }

  if (error.code === "ERR_NETWORK") {
    return "Network error. Please check your connection.";
  }

  const dataMessage = extractApiMessage(error.response?.data);
  if (dataMessage) {
    return dataMessage;
  }

  const status = Number(error.response?.status || 0);
  if (status === 401) return "Unauthorized. Please login again.";
  if (status === 403) return "You are not allowed to perform this action.";
  if (status === 404) return "Requested resource was not found.";
  if (status >= 500) return "Server error. Please try again in a moment.";

  const directMessage = asMessage(error.message);
  if (directMessage) {
    return directMessage;
  }

  return fallback;
}

function isMutationRequest(config) {
  const method = String(config?.method || "").toLowerCase();
  return MUTATION_METHODS.has(method);
}

export function attachApiInterceptors(client) {
  if (!client) return;
  if (client.__toastInterceptorsAttached__) return;

  client.__toastInterceptorsAttached__ = true;

  client.interceptors.response.use(
    (response) => {
      const shouldToastSuccess =
        isMutationRequest(response?.config) && response?.config?.toastSuccess !== false;

      if (shouldToastSuccess) {
        const message = extractApiMessage(response?.data);
        if (message) {
          toast.success(message);
        }
      }

      return response;
    },
    (error) => {
      if (error?.code === "ERR_CANCELED") {
        return Promise.reject(error);
      }

      const shouldToastError = error?.config?.toastError !== false;
      if (shouldToastError) {
        const validationMessages = collectValidationMessages(error?.response?.data?.errors);

        if (validationMessages.length > 0) {
          validationMessages.forEach((message) => toast.error(message));
        } else {
          toast.error(extractErrorMessage(error));
        }
      }

      return Promise.reject(error);
    }
  );
}

export function initInertiaToastListeners() {
  if (inertiaToastInitialized) {
    return;
  }

  inertiaToastInitialized = true;

  let lastSuccess = null;
  let lastError = null;
  let lastValidationHash = null;

  router.on("success", (event) => {
    const props = event?.detail?.page?.props || {};

    const successMessage = asMessage(props.success);
    if (successMessage && successMessage !== lastSuccess) {
      toast.success(successMessage);
      lastSuccess = successMessage;
    }

    const errorMessage = asMessage(props.error);
    if (errorMessage && errorMessage !== lastError) {
      toast.error(errorMessage);
      lastError = errorMessage;
    }

    const validationMessages = collectValidationMessages(props.errors);
    const nextHash = validationMessages.join("|");

    if (validationMessages.length > 0 && nextHash !== lastValidationHash) {
      validationMessages.forEach((message) => toast.error(message));
      lastValidationHash = nextHash;
    }

    if (validationMessages.length === 0) {
      lastValidationHash = null;
    }
  });

  router.on("invalid", () => {
    toast.error("Invalid response received from server.");
  });

  router.on("exception", () => {
    toast.error("Unexpected error occurred. Please try again.");
  });
}
