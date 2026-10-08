import { ZodError } from "better-auth";

export type ErrorCode =
  | "not_found"
  | "forbidden"
  | "validation"
  | "conflict"
  | "unauthenticated"
  | "internal";

export class AppError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
    public readonly status: number,
    public readonly fieldErrors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = new.target.name;
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not found") {
    super("not_found", message, 404);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "You don't have permission to do that") {
    super("forbidden", message, 403);
  }
}

export class ConflictError extends AppError {
  constructor(message = "This was changed by someone else") {
    super("conflict", message, 409);
  }
}

export class ValidationError extends AppError {
  constructor(fieldErrors: Record<string, string[]>, message = "Invalid input") {
    super("validation", message, 400, fieldErrors);
  }
}

export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: { code: ErrorCode; message: string; fieldErrors?: Record<string, string[]> } };

export function toActionError(e: unknown): ActionResult<never> {
  if (e instanceof AppError) {
    return { ok: false, error: { code: e.code, message: e.message, fieldErrors: e.fieldErrors } };
  }
  if (e instanceof ZodError) {
    return {
      ok: false,
      error: { code: "validation", message: "Invalid input", fieldErrors: e.flatten().fieldErrors as Record<string, string[]> },
    };
  }
  console.error(e); // log the real error server-side
  return { ok: false, error: { code: "internal", message: "Something went wrong" } };
}