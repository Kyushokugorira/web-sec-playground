"use client";

import React, { useState } from "react";
import { Button } from "@/app/_components/Button";
import { TextInputField } from "@/app/_components/TextInputField";
import { ErrorMsgField } from "@/app/_components/ErrorMsgField";

const OtpDemoPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [issuedOtp, setIssuedOtp] = useState<string | null>(null);
  const [verifyResult, setVerifyResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // OTP発行
  const handleIssueOtp = async () => {
    setError(null);
    setVerifyResult(null);
    setIssuedOtp(null);
    setIsLoading(true);
    try {
      const res = await fetch("/api/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setIssuedOtp(data.payload.otp);
      } else {
        setError(data.message);
      }
    } catch (e) {
      setError("OTP発行に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  // OTP検証
  const handleVerifyOtp = async () => {
    setError(null);
    setVerifyResult(null);
    setIsLoading(true);
    try {
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (data.success) {
        setVerifyResult("✅ OTP検証成功！");
      } else {
        setVerifyResult("❌ OTPが無効です: " + data.message);
      }
    } catch (e) {
      setVerifyResult("OTP検証に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h1 className="text-xl font-bold mb-4">OTPデモ</h1>
      <div className="mb-4">
        <label className="block font-bold mb-1">メールアドレス</label>
        <TextInputField
          value={email}
          onChange={e => setEmail(e.target.value)}
          type="email"
          placeholder="user@example.com"
          ref={undefined}
        />
      </div>
      <Button onClick={handleIssueOtp} disabled={!email || isLoading}>
        OTP発行
      </Button>
      {issuedOtp && (
        <div className="mt-4 p-2 bg-gray-100 rounded">
          <div className="font-bold">発行されたOTP:</div>
          <div className="text-lg tracking-widest">{issuedOtp}</div>
        </div>
      )}
      <div className="mt-6">
        <label className="block font-bold mb-1">OTP入力</label>
        <TextInputField
          value={otp}
          onChange={e => setOtp(e.target.value)}
          type="text"
          placeholder="6桁のOTP"
          ref={undefined}
        />
        <Button onClick={handleVerifyOtp} disabled={!otp || !email || isLoading} className="mt-2">
          OTP検証
        </Button>
      </div>
      {verifyResult && <div className="mt-4 font-bold">{verifyResult}</div>}
      {error && <ErrorMsgField msg={error} />}
    </main>
  );
};

export default OtpDemoPage;
