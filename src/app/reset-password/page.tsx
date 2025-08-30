"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordRequestSchema, ResetPasswordRequest } from "@/app/_types/ResetPassword";
import axios from "axios";

export default function ResetPasswordPage() {
  const [step, setStep] = useState<"request" | "reset" | "done">("request");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [otpValue, setOtpValue] = useState<string | null>(null);
  const form = useForm<ResetPasswordRequest>({
    resolver: zodResolver(resetPasswordRequestSchema),
  });

  // OTPリクエスト
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setOtpValue(null);
    try {
      const res = await axios.post("/api/otp", { email });
      if (res.data.success) {
        setStep("reset");
        setOtpValue(res.data.payload?.otp || null);
        setMessage("OTPを送信しました（画面上に表示されます）");
      } else {
        setMessage(res.data.message || "エラーが発生しました");
      }
    } catch {
      setMessage("サーバーエラー");
    }
  };

  // パスワードリセット
  const onSubmit = async (data: ResetPasswordRequest) => {
    setMessage("");
    try {
      const res = await axios.post("/api/reset-password", data);
      if (res.data.success) {
        setStep("done");
      } else {
        setMessage(res.data.message || "エラーが発生しました");
      }
    } catch {
      setMessage("サーバーエラー");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded bg-white">
      <h1 className="text-xl font-bold mb-4">パスワードリセット</h1>
      {step === "request" && (
        <form onSubmit={handleRequestOtp} className="space-y-4">
          <div>
            <label className="block mb-1">メールアドレス</label>
            <input type="email" className="border px-2 py-1 w-full" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">OTP送信</button>
        </form>
      )}
      {step === "reset" && (
        <>
          {otpValue && (
            <div className="mb-2 p-2 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded">
              <span className="font-bold">OTP:</span> {otpValue}
            </div>
          )}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block mb-1">メールアドレス</label>
              <input type="email" className="border px-2 py-1 w-full" {...form.register("email")} defaultValue={email} />
            </div>
            <div>
              <label className="block mb-1">新しいパスワード</label>
              <input type="password" className="border px-2 py-1 w-full" {...form.register("newPassword")} />
            </div>
            <div>
              <label className="block mb-1">OTP</label>
              <input type="text" className="border px-2 py-1 w-full" {...form.register("otp")} />
            </div>
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">パスワードリセット</button>
          </form>
        </>
      )}
      {step === "done" && (
        <div className="text-green-700 font-bold">パスワードをリセットしました。ログインしてください。</div>
      )}
      {message && <div className="mt-4 text-red-600">{message}</div>}
    </div>
  );
}
