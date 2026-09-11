// engine/core/http/responses.ts

import { NextResponse } from "next/server";
import { AppError } from "./errors";

export function ok(data: any, meta: any = {}) { 
  return NextResponse.json({ success: true, data, meta }, { status: 200 });
} 
export function blob(data: any, name = "invoice") {
  return new NextResponse(data, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${name}.pdf"`, 
    },
  });
}
export function pdf(data: any, name = "invoice") {
  return new NextResponse(data, {
    headers: {
      "X-Response-Type": "pdf",
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${name}.pdf"`
    }
  });
}

export function created(data: any) {
  return NextResponse.json({ success: true, data }, { status: 201 });
}

export function noContent() {
  return new NextResponse(null, { status: 204 });
}

export function fail(error: any) {
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
        code: error.code,
        ...(error as any).details && { details: (error as any).details },
      },
      { status: error.status }
    );
  }

  console.error("UNEXPECTED ERROR:", error);

  return NextResponse.json(
    { success: false, message: `${error}` },
    { status: 500 }
  );
}

function removeFromString( source: string ): string {
  const removeList = ["AssertionError [ERR_ASSERTION]: ", "Error:"];
  let result = source;

  for (const value of removeList) {
    result = result.split(value).join('');
  }

  return result;
} 
