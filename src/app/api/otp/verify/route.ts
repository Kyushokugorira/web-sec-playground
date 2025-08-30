import { prisma } from "@/libs/prisma";
import { NextResponse, NextRequest } from "next/server";
import type { ApiResponse } from "@/app/_types/ApiResponse";

export const POST = async (req: NextRequest) => {
  try {
    const { email, otp } = await req.json();
    if (!email || typeof email !== "string" || !otp || typeof otp !== "string") {
      return NextResponse.json({
        success: false,
        payload: null,
        message: "メールアドレスまたはOTPが不正です。",
      } satisfies ApiResponse<null>);
    }
    // ユーザー取得
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({
        success: false,
        payload: null,
        message: "ユーザーが見つかりません。",
      } satisfies ApiResponse<null>);
    }
    // OTP取得
    const otpRecord = await prisma.otp.findFirst({
      where: {
        userId: user.id,
        otp,
        expiresAt: { gt: new Date() },
      },
    });
    if (!otpRecord) {
      return NextResponse.json({
        success: false,
        payload: null,
        message: "OTPが無効または期限切れです。",
      } satisfies ApiResponse<null>);
    }
    // （任意）一度使ったOTPは削除
    await prisma.otp.delete({ where: { id: otpRecord.id } });
    return NextResponse.json({
      success: true,
      payload: null,
      message: "OTP検証成功",
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
