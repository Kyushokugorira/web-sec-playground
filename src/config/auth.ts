// ▼▼ 認証モードにあわせていずれかを有効にする


// JWT認証のみ有効
export const AUTH = {
  mode: "jwt",
  isSession: false,
  isJWT: true,
} as const;
