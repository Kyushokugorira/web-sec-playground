import { prisma } from "@/libs/prisma";
import { NextResponse, NextRequest } from "next/server";
import type { ApiResponse } from "@/app/_types/ApiResponse";

export const POST = async (req: NextRequest) => {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json({
        success: false,
        payload: null,
        message: "メールアドレスが不正です。",
      } satisfies ApiResponse<null>);
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      return NextResponse.json({
        success: false,
        payload: null,
        message: "このメールアドレスは既に使用されています。",
      } satisfies ApiResponse<null>);
    }
    return NextResponse.json({
      success: true,
      payload: null,
      message: "使用可能なメールアドレスです。",
    } satisfies ApiResponse<null>);
  } catch (e) {
    const errorMsg = e instanceof Error ? e.message : "Internal Server Error";
    return NextResponse.json({
      success: false,
      payload: null,
      message: errorMsg,
    } satisfies ApiResponse<null>);
  }
};
