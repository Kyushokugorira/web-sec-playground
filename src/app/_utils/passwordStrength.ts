// パスワード強度判定ユーティリティ
// 仕様：
// 弱い（Weak）: 8文字未満、または特定の文字種が1種類のみ。
// 普通（Fair）: 8文字以上、かつ特定の文字種が2種類以上。
// 強い（Strong）: 12文字以上、かつ特定の文字種が3種類以上。
// 非常に強い（Very Strong）: 16文字以上、かつ特定の文字種が4種類すべて。

export type PasswordStrength = "Weak" | "Fair" | "Strong" | "Very Strong";

export function getPasswordStrength(password: string): PasswordStrength {
  const length = password.length;
  let types = 0;
  if (/[a-z]/.test(password)) types++;
  if (/[A-Z]/.test(password)) types++;
  if (/[0-9]/.test(password)) types++;
  if (/[^a-zA-Z0-9]/.test(password)) types++;

  if (length >= 16 && types === 4) return "Very Strong";
  if (length >= 12 && types >= 3) return "Strong";
  if (length >= 8 && types >= 2) return "Fair";
  return "Weak";
}
