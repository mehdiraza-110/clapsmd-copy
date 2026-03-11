"use client";

import { useEffect, useState } from "react";
import { getServices } from "@/lib/authClient";

const SKELETON_ITEMS = 6;

function ConditionsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
      {Array.from({ length: SKELETON_ITEMS }).map((_, index) => (
        <div
          key={index}
          className="bg-slate-50 border border-slate-100 p-6 rounded-xl animate-pulse"
        >
          <div className="flex items-start">
            <span className="w-2 h-2 bg-slate-200 rounded-full mt-3 mr-4 flex-shrink-0" />
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
    <section id="conditions" className="py-20 bg-white">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {services.map((service) => (
              <div
                key={service.id ?? service.service_name}
                className="bg-slate-50 border border-slate-100 p-6 rounded-xl"
              >
                <div className="flex items-start">
                  <span className="w-2 h-2 bg-primary rounded-full mt-3 mr-4 flex-shrink-0" />
                  <div>
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
          <div className="max-w-3xl mx-auto rounded-2xl border border-slate-200 bg-slate-50 px-6 py-8 text-center text-gray-600">
            {error || "No conditions are available right now."}
          </div>
        ) : null}
      </div>
    </section>
  );
}
