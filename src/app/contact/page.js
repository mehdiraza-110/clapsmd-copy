import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MapPin, Phone, Mail, Clock3 } from "lucide-react";
import { buildPageMetadata } from "@/lib/seoMetadata";

export const metadata = buildPageMetadata({
  title: "Contact | C.L.A.P.S. MD",
  description:
    "Contact CLAPS MD in Wayne, NJ for appointments, referrals, billing questions, and general office support.",
  path: "/contact",
  ogImage: "/images/clapsmd-logo-high-res.jpg",
});

const officeHours = [
  ["Monday", "9:00 AM - 4:00 PM"],
  ["Tuesday", "9:00 AM - 4:00 PM"],
  ["Wednesday", "Closed"],
  ["Thursday", "9:00 AM - 4:00 PM"],
  ["Friday", "9:00 AM - 4:00 PM"],
  ["Saturday - Sunday", "Closed"],
];

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="bg-slate-50">
        <section className="bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
            <div className="max-w-3xl">
              <p className="text-sm font-black uppercase tracking-[0.24em] text-primary">
                Contact
              </p>
              <h1 className="mt-4 text-4xl sm:text-5xl font-black text-secondary tracking-tight leading-tight">
                Contact the Office
              </h1>
              <p className="mt-6 text-lg text-gray-700 leading-8">
                Reach out to CLAPS MD for appointments, referrals, billing questions, and general
                office support. We are here to help families get the information they need.
              </p>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
          <div className="grid grid-cols-1 lg:grid-cols-[0.95fr,1.05fr] gap-8">
            <div className="space-y-6">
              <div className="rounded-[2rem] border border-slate-100 bg-white p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <h2 className="text-2xl font-black text-secondary tracking-tight">Call Us</h2>
                </div>
                <p className="mt-4 text-gray-700 leading-8">
                  Main Phone:{" "}
                  <a href="tel:9739490270" className="font-semibold text-secondary hover:text-primary">
                    (973) 949-0270
                  </a>
                </p>
                <p className="mt-2 text-gray-700 leading-8">Fax: (973) 310-7031</p>
              </div>

              <div className="rounded-[2rem] border border-slate-100 bg-white p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <h2 className="text-2xl font-black text-secondary tracking-tight">Email</h2>
                </div>
                <p className="mt-4 text-gray-700 leading-8">
                  <a href="mailto:info@clapsmd.org" className="font-semibold text-secondary hover:text-primary">
                    info@clapsmd.org
                  </a>
                </p>
              </div>

              <div className="rounded-[2rem] border border-slate-100 bg-white p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-3">
                  <Clock3 className="w-5 h-5 text-primary" />
                  <h2 className="text-2xl font-black text-secondary tracking-tight">Office Hours</h2>
                </div>
                <div className="mt-4 space-y-3 text-gray-700">
                  {officeHours.map(([day, hours]) => (
                    <div key={day} className="flex items-center justify-between gap-4">
                      <span className="font-semibold text-secondary">{day}</span>
                      <span>{hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-100 bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-black text-secondary tracking-tight">Visit Us</h2>
              </div>
              <p className="mt-4 text-gray-700 leading-8">
                2025 Hamburg Turnpike, Suite H
                <br />
                Wayne, NJ 07470
              </p>
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=2025+Hamburg+Turnpike+Suite+H+Wayne+NJ+07470"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center justify-center rounded-md bg-secondary px-6 py-3 font-semibold text-white transition-colors hover:bg-secondary/90"
              >
                Get Directions
              </a>
              <div className="mt-8 overflow-hidden rounded-[1.5rem] border border-slate-200">
                <iframe
                  title="CLAPS MD office map"
                  src="https://www.google.com/maps?q=2025+Hamburg+Turnpike+Suite+H+Wayne+NJ+07470&output=embed"
                  width="100%"
                  height="320"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
