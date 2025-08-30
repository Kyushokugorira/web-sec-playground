import { prisma } from "@/libs/prisma";
import { NextResponse, NextRequest } from "next/server";
import type { ApiResponse } from "@/app/_types/ApiResponse";
import crypto from "crypto";

// OTPの有効期限（分）
const OTP_EXPIRE_MINUTES = 10;

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
    // ユーザー存在確認
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({
        success: false,
        payload: null,
        message: "該当するユーザーが見つかりません。",
      } satisfies ApiResponse<null>);
    }
    // OTP生成
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + OTP_EXPIRE_MINUTES * 60 * 1000);
    // 既存OTP削除
  await prisma.otp.deleteMany({ where: { userId: user.id } });
    // DBに保存
    await prisma.otp.create({
      data: {
        userId: user.id,
        otp,
        expiresAt,
      },
    });
    // TODO: メール送信処理をここに追加
    // ここではダミーでOTPを返す
    return NextResponse.json({
      success: true,
      payload: { otp },
      message: "OTPを発行しました（本来はメール送信）。",
    } satisfies ApiResponse<{ otp: string }>);
  } catch (e) {
    const errorMsg = e instanceof Error ? e.message : "Internal Server Error";
    return NextResponse.json({
      success: false,
      payload: null,
      message: errorMsg,
    } satisfies ApiResponse<null>);
  }
};
