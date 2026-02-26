import { NextResponse } from "next/server";

import { logger } from "./logger";

export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export class ApiUtils {
  static success<T>(data: T, message?: string, status = 200, headers?: Record<string, string>) {
    return NextResponse.json(
      { success: true, data, message },
      { status, headers }
    );
  }

  static error(error: string, status = 400, context?: Record<string, unknown>) {
    if (status >= 500) {
      logger.error(`API Error: ${error}`, undefined, context);
    } else {
      logger.warn(`API Warning: ${error}`, context);
    }
    return NextResponse.json(
      { success: false, error },
      { status }
    );
  }

  static serverError(error: unknown, context?: Record<string, unknown>) {
    logger.error("Internal Server Error caught by ApiUtils", error, context);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
