"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, Mail, Phone, User } from "lucide-react";
import {
  clearSession,
  getToken,
  isAuthError,
  me,
  register,
  setSession,
} from "@/lib/authClient";

export default function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
  });
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
      .catch((_authError) => {
        clearSession();
      });
  }, [router]);

  const setField = (name, value) => {
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const registerResponse = await register(form);
      const token = registerResponse?.token;
      if (!token) {
        throw new Error("Token not found in register response");
      }

      const meResponse = await me(token);
      setSession({
        token,
        user: meResponse?.user ?? registerResponse?.user ?? null,
      });
      router.push("/admin/dashboard");
    } catch (submitError) {
      if (isAuthError(submitError)) {
        clearSession();
      }
      setError(submitError?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="first_name"
            className="block text-sm font-bold text-secondary mb-2"
          >
            First Name
          </label>
          <div className="relative">
            <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="first_name"
              name="first_name"
              type="text"
              required
              value={form.first_name}
              onChange={(event) => setField("first_name", event.target.value)}
              placeholder="John"
              className="w-full h-12 pl-10 pr-4 rounded-xl border border-gray-200 text-secondary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="last_name"
            className="block text-sm font-bold text-secondary mb-2"
          >
            Last Name
          </label>
          <div className="relative">
            <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="last_name"
              name="last_name"
              type="text"
              required
              value={form.last_name}
              onChange={(event) => setField("last_name", event.target.value)}
              placeholder="Doe"
              className="w-full h-12 pl-10 pr-4 rounded-xl border border-gray-200 text-secondary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
            />
          </div>
        </div>
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-bold text-secondary mb-2"
        >
          Email Address
        </label>
        <div className="relative">
          <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={(event) => setField("email", event.target.value)}
            placeholder="user@example.com"
            className="w-full h-12 pl-10 pr-4 rounded-xl border border-gray-200 text-secondary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-bold text-secondary mb-2"
        >
          Phone
        </label>
        <div className="relative">
          <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="phone"
            name="phone"
            type="text"
            required
            value={form.phone}
            onChange={(event) => setField("phone", event.target.value)}
            placeholder="123456789"
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
            autoComplete="new-password"
            value={form.password}
            onChange={(event) => setField("password", event.target.value)}
            placeholder="Create a password"
            className="w-full h-12 pl-10 pr-4 rounded-xl border border-gray-200 text-secondary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
          />
        </div>
      </div>

      {error ? <p className="text-sm font-semibold text-red-600">{error}</p> : null}

      <div className="flex items-center justify-between">
        <Link
          href="/admin/login"
          className="text-sm font-semibold text-primary hover:underline"
        >
          Already have an account? Sign in
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
        {loading ? "Creating Account..." : "Create Account"}
      </button>
    </form>
  );
}
