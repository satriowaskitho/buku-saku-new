const BASE_URL = "https://kakukli-backend-lac.vercel.app";

export const loginAPI = async (username: string, password: string) => {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Login gagal");

  return data;
};