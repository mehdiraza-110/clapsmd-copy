"use client";

import { useEffect, useState } from "react";
import { getActiveAnnouncements } from "@/lib/authClient";
import { Bell, CalendarDays } from "lucide-react";

function formatDate(value) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(d);
}

export default function HomepageAnnouncements() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getActiveAnnouncements()
      .then((res) => {
        const all = Array.isArray(res?.announcements) ? res.announcements : [];
        setItems(all.slice(0, 3));
      })
      .catch(() => {});
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="relative bg-[linear-gradient(180deg,#f0f7fb_0%,#e8f2f8_100%)] py-20">
      <div className="absolute -right-10 top-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -left-10 bottom-10 h-48 w-48 rounded-full bg-secondary/8 blur-3xl" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 mb-4">
            <Bell className="w-4 h-4 text-primary" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-secondary">Announcements</span>
          </div>
          <h2 className="text-3xl font-bold text-primary-darker mb-4">Latest Updates</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6" />
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stay up to date with the latest news and important information from CLAPS MD.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => {
            const date = formatDate(item.publish_time ?? item.scheduled_time);
            return (
              <div
                key={item.id}
                className="glass-card soft-gradient-panel group flex flex-col rounded-[2rem] p-7 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3 mb-5">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                    <Bell className="h-5 w-5 text-primary" />
                  </div>
                  {date && (
                    <div className="flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-secondary">
                      <CalendarDays className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                      {date}
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center">
                  <span className="service-divider-track">
                    <span className="service-divider-fill" />
                  </span>
                  <span className="service-divider-dot ml-3" />
                </div>

                <h3 className="mt-4 text-xl font-bold leading-snug text-secondary">
                  {item.title}
                </h3>

                <p className="mt-3 flex-1 text-base leading-7 text-slate-500 line-clamp-4">
                  {item.message}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
