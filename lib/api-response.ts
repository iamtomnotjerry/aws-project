import { NextResponse } from "next/server";

export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export class ApiUtils {
  static success<T>(data: T, message?: string, status = 200) {
    return NextResponse.json(
      { success: true, data, message },
      { status }
    );
  }

  static error(error: string, status = 400) {
    return NextResponse.json(
      { success: false, error },
      { status }
    );
  }

  static serverError(error: unknown) {
    console.error("[API_ERROR]:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
