
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { resetPasswordRequestSchema } from "@/app/_types/ResetPassword";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const parsed = resetPasswordRequestSchema.safeParse(body);
		if (!parsed.success) {
			return NextResponse.json({ success: false, message: "不正なリクエスト形式です。" }, { status: 400 });
		}
		const { email, newPassword, otp } = parsed.data;

		// ユーザー取得
		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) {
			return NextResponse.json({ success: false, message: "ユーザーが見つかりません。" }, { status: 404 });
		}

		// OTP検証
		const otpRecord = await prisma.otp.findFirst({
			where: {
				userId: user.id,
				otp,
				expiresAt: { gte: new Date() },
			},
			orderBy: { expiresAt: "desc" },
		});
		if (!otpRecord) {
			return NextResponse.json({ success: false, message: "OTPが無効または期限切れです。" }, { status: 400 });
		}

		// パスワードハッシュ化
		const hashed = await bcrypt.hash(newPassword, 10);
		await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });

		// OTPは一度使ったら削除
		await prisma.otp.delete({ where: { id: otpRecord.id } });

		return NextResponse.json({ success: true, message: "パスワードをリセットしました。" });
	} catch (e) {
		return NextResponse.json({ success: false, message: "サーバーエラー" }, { status: 500 });
	}
}
