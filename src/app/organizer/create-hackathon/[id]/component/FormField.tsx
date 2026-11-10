"use client";

import React, { createContext, useContext } from "react";
import { AlertCircleIcon } from "lucide-react";
import type { FieldErrors } from "../validation";

interface WizardErrorsContextValue {
  errors: FieldErrors;
  clearError: (field: string) => void;
}

export const WizardErrorsContext = createContext<WizardErrorsContextValue>({
  errors: {},
  clearError: () => {},
});

/** Returns the current error for a field and a helper that clears it (call on change). */
export function useFieldError(field: string) {
  const { errors, clearError } = useContext(WizardErrorsContext);
  return { error: errors[field], clear: () => errors[field] && clearError(field) };
}

export function FieldLabel({
  children,
  htmlFor,
  required,
  className = "",
}: {
  children: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={`text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider ${className}`}
    >
      {children}
      {required ? (
        <span className="text-red-500 ml-1" aria-hidden="true">*</span>
      ) : (
        <span className="ml-2 normal-case tracking-normal font-normal text-xs text-gray-400">(optional)</span>
      )}
    </label>
  );
}

export function FieldError({ message, id }: { message?: string; id?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 flex items-start gap-1.5 text-sm text-red-600 dark:text-red-400">
      <AlertCircleIcon className="w-4 h-4 mt-0.5 shrink-0" />
      <span>{message}</span>
    </p>
  );
}

/** Tailwind classes to add to an input's border when it has an error. */
export const errorRing = (hasError: boolean) =>
  hasError ? "!border-red-500 focus:!ring-red-500" : "";
