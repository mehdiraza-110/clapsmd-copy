"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Bell,
  Briefcase,
  FileText,
  Newspaper,
  LogOut,
  Menu,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  clearSession,
  getToken,
  getUser,
  isAuthError,
  me,
  setSession,
} from "@/lib/authClient";
import CircularLoader from "@/components/CircularLoader";

function routePatternToRegex(pattern) {
  const escaped = pattern
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    .replace(/:([^/]+)/g, "[^/]+");
  return new RegExp(`^${escaped}$`);
}

function normalizeAllowedPattern(pattern) {
  if (!pattern || typeof pattern !== "string") return "";
  if (pattern.startsWith("/admin")) return pattern;
  return `/admin${pattern === "/" ? "" : pattern}`;
}

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthPage = pathname === "/admin/login" || pathname === "/admin/register";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [allowedRoutes, setAllowedRoutes] = useState([]);
  const menuRef = useRef(null);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const canAccessRoute = (path) => {
    if (!allowedRoutes.length) return true;
    return allowedRoutes.some((pattern) => {
      const normalizedPattern = normalizeAllowedPattern(pattern);
      if (!normalizedPattern) return false;
      return routePatternToRegex(normalizedPattern).test(path);
    });
  };

  const handleLogout = () => {
    clearSession();
    setMenuOpen(false);
    router.push("/admin/login");
  };

  const navItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: BarChart3 },
    { label: "Blogs", href: "/admin/blogs", icon: Newspaper },
    { label: "Recent Activity", href: "/admin/activity", icon: FileText },
    { label: "Services", href: "/admin/services", icon: Briefcase },
    { label: "Notices", href: "/admin/notices", icon: Bell },
  ].filter((item) => canAccessRoute(item.href));

  useEffect(() => {
    let active = true;

    const restore = async () => {
      if (isAuthPage) {
        if (active) setAuthReady(true);
        return;
      }

      const token = getToken();
      if (!token) {
        clearSession();
        router.replace("/admin/login");
        if (active) setAuthReady(true);
        return;
      }

      try {
        const response = await me(token);
        if (!active) return;
        const user = response?.user ?? getUser();
        setSession({ token, user });
        setAllowedRoutes(Array.isArray(user?.allowedRoutes) ? user.allowedRoutes : []);
      } catch (authError) {
        if (!active) return;
        if (isAuthError(authError)) {
          clearSession();
          router.replace("/admin/login");
        } else {
          clearSession();
          router.replace("/admin/login");
        }
      } finally {
        if (active) setAuthReady(true);
      }
    };

    restore();

    return () => {
      active = false;
    };
  }, [router, isAuthPage]);

  useEffect(() => {
    if (!authReady || isAuthPage) return;
    if (!canAccessRoute(pathname)) {
      const fallback = canAccessRoute("/admin/dashboard")
        ? "/admin/dashboard"
        : "/admin/login";
      router.replace(fallback);
    }
  }, [authReady, pathname, router, allowedRoutes, isAuthPage]);

  if (isAuthPage) {
    return children;
  }

  if (!authReady) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
        <CircularLoader label="Checking session..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-secondary text-white z-40 transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="min-h-[132px] px-6 py-5 border-b border-white/10 flex items-start justify-between">
          <div className="flex-1 flex flex-col items-center text-center">
            <div className="relative h-14 w-40">
              <Image
                src="/images/clapsmd-logo-high-res.svg"
                alt="CLAPS MD logo"
                fill
                priority
                className="object-cover rounded-xl"
              />
            </div>
            <p className="mt-3 text-primary text-xs uppercase tracking-[0.2em] font-black">
              Admin Panel
            </p>
            <p className="text-xl font-black tracking-tight">CLAPS MD</p>
          </div>
          <button
            type="button"
            className="lg:hidden text-white/80 hover:text-white ml-3"
            onClick={() => setMobileOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`w-full rounded-xl px-4 py-3 flex items-center font-semibold transition-colors ${
                  active
                    ? "bg-primary text-secondary"
                    : "text-white/85 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="h-20 bg-white border-b border-gray-100 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="lg:hidden p-2 rounded-lg text-secondary hover:bg-slate-100"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="inline-flex items-center text-secondary">
              <ShieldCheck className="w-5 h-5 text-primary mr-2" />
              <span className="font-black tracking-tight">Administrator</span>
            </div>
          </div>

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center font-bold"
              onClick={() => setMenuOpen((value) => !value)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
            >
              <User className="w-5 h-5" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden">
                <button
                  type="button"
                  className="w-full px-4 py-3 text-sm font-semibold text-secondary hover:bg-slate-50 flex items-center"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2 text-primary" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
