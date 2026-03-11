"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, User } from "lucide-react";
import { clearSession, isAuthError, login, me, setSession, getToken } from "@/lib/authClient";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    me(token)
      .then((response) => {
        setSession({ token, user: response?.user });
        router.replace("/admin/dashboard");
      })
      .catch((authError) => {
        if (isAuthError(authError)) {
          clearSession();
          return;
        }
        clearSession();
      });
  }, [router]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const loginResponse = await login({ email, password });
      const token = loginResponse?.token;
      if (!token) {
        throw new Error("Token not found in login response");
      }

      const meResponse = await me(token);
      setSession({
        token,
        user: meResponse?.user ?? loginResponse?.user ?? null,
      });
      router.push("/admin/dashboard");
    } catch (submitError) {
      if (isAuthError(submitError)) {
        clearSession();
      }
      setError(submitError?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-bold text-secondary mb-2"
        >
          Email Address
        </label>
        <div className="relative">
          <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="admin@clapsmd.org"
            className="w-full h-12 pl-10 pr-4 rounded-xl border border-gray-200 text-secondary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-bold text-secondary mb-2"
        >
          Password
        </label>
        <div className="relative">
          <LockKeyhole className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            className="w-full h-12 pl-10 pr-4 rounded-xl border border-gray-200 text-secondary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
          />
        </div>
      </div>

      {error ? (
        <p className="text-sm font-semibold text-red-600">{error}</p>
      ) : null}

      <div className="flex items-center justify-between">
        <Link
          href="/admin/register"
          className="text-sm font-semibold text-primary hover:underline"
        >
          Create account
        </Link>
        <Link
          href="/"
          className="text-sm font-semibold text-primary hover:underline"
        >
          Back to site
        </Link>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full h-12 rounded-xl bg-primary text-white font-black tracking-wide hover:bg-primary-dark transition-colors"
      >
        {loading ? "Signing In..." : "Sign In"}
      </button>
    </form>
  );
}
