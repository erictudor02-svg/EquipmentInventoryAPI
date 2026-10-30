import type {
  Request,
  Response,
  NextFunction
} from "express";
import { ApiError } from "../errors/api-error";

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
): void {
  if (res.headersSent) {
    next(error);
    return;
  }

  if (error instanceof ApiError) {
    res.status(error.status).json({
      error: {
        code: error.code,
        message: error.message,
        ...(error.fields ? { fields: error.fields } : {})
      }
    });
    return;
  }

  if (
    error instanceof SyntaxError &&
    "type" in error &&
    error.type === "entity.parse.failed"
  ) {
    res.status(400).json({
      error: {
        code: "INVALID_JSON",
        message: "Request body contains invalid JSON."
      }
    });
    return;
  }

  console.error("Unexpected API error:", error);

  res.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected server error occurred."
    }
  });
}