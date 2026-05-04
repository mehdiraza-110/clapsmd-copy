"use client";

import { useEffect, useState } from "react";
import { getClinicHours } from "@/lib/authClient";

const FALLBACK = [
  { id: 1, day_of_week: "Monday",    day_order: 1, open_time: "9:00 AM", close_time: "4:00 PM", is_closed: false },
  { id: 2, day_of_week: "Tuesday",   day_order: 2, open_time: "9:00 AM", close_time: "4:00 PM", is_closed: false },
  { id: 3, day_of_week: "Wednesday", day_order: 3, open_time: null,      close_time: null,      is_closed: true  },
  { id: 4, day_of_week: "Thursday",  day_order: 4, open_time: "9:00 AM", close_time: "4:00 PM", is_closed: false },
  { id: 5, day_of_week: "Friday",    day_order: 5, open_time: "9:00 AM", close_time: "4:00 PM", is_closed: false },
  { id: 6, day_of_week: "Saturday",  day_order: 6, open_time: null,      close_time: null,      is_closed: true  },
  { id: 7, day_of_week: "Sunday",    day_order: 7, open_time: null,      close_time: null,      is_closed: true  },
];

function shortDayLabel(day, index, all) {
  // Collapse consecutive closed weekend days into "Sat - Sun"
  if (day.day_of_week === "Saturday" && all[index + 1]?.is_closed && all[index + 1]?.day_of_week === "Sunday") {
    return "Sat - Sun";
  }
  if (day.day_of_week === "Sunday" && all[index - 1]?.day_of_week === "Saturday" && all[index - 1]?.is_closed) {
    return null; // skip, already shown as "Sat - Sun"
  }
  return day.day_of_week;
}

export default function FooterClinicHours() {
  const [hours, setHours] = useState(FALLBACK);

  useEffect(() => {
    getClinicHours()
      .then((res) => {
        const data = Array.isArray(res?.clinic_hours) ? res.clinic_hours : [];
        if (data.length > 0) {
          setHours(data.slice().sort((a, b) => a.day_order - b.day_order));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <ul className="space-y-3 text-gray-400 text-sm">
      {hours.map((day, i) => {
        const label = shortDayLabel(day, i, hours);
        if (label === null) return null;
        return (
          <li
            key={day.id}
            className={`flex justify-between ${day.is_closed ? "text-gray-500 italic" : ""}`}
          >
            <span>{label}:</span>
            <span>
              {day.is_closed ? "Closed" : `${day.open_time} - ${day.close_time}`}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
