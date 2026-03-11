import { UserPlus } from "lucide-react";
import { buildPageMetadata } from "@/lib/seoMetadata";
import RegisterForm from "./RegisterForm";

export const metadata = buildPageMetadata({
  title: "Admin Register | C.L.A.P.S. MD",
  description:
    "Create an administrator account for CLAPS MD portal access in Wayne, NJ and Northern New Jersey.",
  path: "/admin/register",
  ogImage: "/images/clapsmd-logo-high-res.jpg",
});

export default function AdminRegisterPage() {
  return (
    <main className="min-h-screen bg-slate-100 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-20 w-80 h-80 bg-secondary/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 sm:p-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/15 text-primary mb-6">
              <UserPlus className="w-7 h-7" />
            </div>

            <h1 className="text-3xl font-black text-secondary tracking-tight">
              Admin Register
            </h1>
            <p className="mt-2 text-gray-600">
              Create your administrator account to access secure portal tools.
            </p>

            <RegisterForm />
          </div>
        </div>
      </div>
    </main>
  );
}
