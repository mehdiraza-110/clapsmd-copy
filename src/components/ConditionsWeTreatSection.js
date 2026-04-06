"use client";

import { useEffect, useState } from "react";
import { getServices } from "@/lib/authClient";
import { Stethoscope } from "lucide-react";

const SKELETON_ITEMS = 6;

function ConditionsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {Array.from({ length: SKELETON_ITEMS }).map((_, index) => (
        <div
          key={index}
          className="site-surface-muted rounded-[1.75rem] p-6 animate-pulse"
        >
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-2xl bg-slate-200/80" />
            <div className="flex-1 space-y-3">
              <div className="h-6 w-3/4 rounded bg-slate-200" />
              <div className="h-4 w-full rounded bg-slate-200" />
              <div className="h-4 w-5/6 rounded bg-slate-200" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ConditionsWeTreatSection() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadServices() {
      setLoading(true);
      setError("");

      try {
        const response = await getServices();
        if (!active) return;

        const visibleServices = Array.isArray(response?.services)
          ? response.services
              .filter((service) => service?.visibility_status)
              .sort((left, right) => Number(left?.id || 0) - Number(right?.id || 0))
          : [];

        setServices(visibleServices);
      } catch (requestError) {
        if (!active) return;
        setError(requestError?.message || "Failed to load conditions");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadServices();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="conditions" className="relative overflow-hidden py-20">
      <div className="absolute left-0 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-secondary/8 blur-3xl" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-black text-secondary uppercase tracking-tight mb-4">
            Conditions We Treat
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            CLAPS MD provides specialized evaluation and care for a wide range of pediatric respiratory concerns.
          </p>
        </div>

        {loading ? <ConditionsSkeleton /> : null}

        {!loading && services.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 max-w-4xl mx-auto">
            {services.map((service) => (
              <div
                key={service.id ?? service.service_name}
                className="site-surface group relative overflow-hidden rounded-[1.75rem] p-6"
              >
                <div className="absolute right-4 top-4 h-20 w-20 rounded-full bg-primary/10 blur-2xl transition-transform duration-300 group-hover:scale-125" />
                <div className="relative flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-white shadow-lg">
                    <Stethoscope className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold tracking-tight text-secondary">
                      {service.service_name}
                    </h3>
                    {service.service_description ? (
                      <p className="mt-3 text-base leading-7 text-gray-600">
                        {service.service_description}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {!loading && !services.length ? (
          <div className="site-surface-muted max-w-3xl mx-auto rounded-[1.75rem] px-6 py-8 text-center text-gray-600">
            {error || "No conditions are available right now."}
          </div>
        ) : null}
      </div>
    </section>
  );
}
