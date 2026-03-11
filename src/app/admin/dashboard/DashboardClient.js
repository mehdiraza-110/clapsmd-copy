"use client";

import { BarChart3, Briefcase, Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  clearSession,
  getDashboardStats,
  getPublishedBlogsLast6Months,
  getToken,
  isAuthError,
} from "@/lib/authClient";
import CircularLoader from "@/components/CircularLoader";

const statCards = [
  {
    key: "total_active_services",
    label: "Total Active Services",
    icon: Briefcase,
  },
  {
    key: "total_published_announcements",
    label: "Total Published Announcements",
    icon: Bell,
  },
  {
    key: "total_published_blog_posts",
    label: "Total Published Blog Posts",
    icon: BarChart3,
  },
];

const CHART_WIDTH = 760;
const CHART_HEIGHT = 260;
const CHART_PADDING = {
  top: 18,
  right: 20,
  bottom: 48,
  left: 42,
};

export default function DashboardClient() {
  const router = useRouter();
  const token = getToken();

  const [stats, setStats] = useState({
    total_active_services: 0,
    total_published_announcements: 0,
    total_published_blog_posts: 0,
  });
  const [publishedBlogStats, setPublishedBlogStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const maxPublishedBlogsValue = Math.max(
    ...publishedBlogStats.map((entry) => Number(entry?.total_published_blog_posts || 0)),
    1,
  );
  const chartInnerWidth = CHART_WIDTH - CHART_PADDING.left - CHART_PADDING.right;
  const chartInnerHeight = CHART_HEIGHT - CHART_PADDING.top - CHART_PADDING.bottom;
  const chartPoints = publishedBlogStats.map((entry, index) => {
    const value = Number(entry?.total_published_blog_posts || 0);
    const x =
      CHART_PADDING.left +
      (publishedBlogStats.length === 1
        ? chartInnerWidth / 2
        : (index / (publishedBlogStats.length - 1)) * chartInnerWidth);
    const y =
      CHART_PADDING.top +
      chartInnerHeight -
      (value / maxPublishedBlogsValue) * chartInnerHeight;

    return {
      ...entry,
      value,
      x,
      y,
    };
  });
  const linePath = chartPoints
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
  const areaPath = chartPoints.length
    ? `${linePath} L ${chartPoints[chartPoints.length - 1].x} ${
        CHART_PADDING.top + chartInnerHeight
      } L ${chartPoints[0].x} ${CHART_PADDING.top + chartInnerHeight} Z`
    : "";
  const yAxisTicks = Array.from({ length: 4 }, (_item, index) => {
    const ratio = index / 3;
    const value = Math.round(maxPublishedBlogsValue - ratio * maxPublishedBlogsValue);
    const y = CHART_PADDING.top + ratio * chartInnerHeight;
    return { value, y };
  });

  const handleAuthFailure = () => {
    clearSession();
    router.replace("/admin/login");
  };

  useEffect(() => {
    let active = true;

    const loadStats = async () => {
      if (!token) {
        handleAuthFailure();
        return;
      }

      setLoading(true);
      setError("");

      try {
        const [statsResponse, publishedBlogsResponse] = await Promise.all([
          getDashboardStats(token),
          getPublishedBlogsLast6Months(token),
        ]);
        if (!active) return;

        setStats({
          total_active_services: Number(statsResponse?.stats?.total_active_services || 0),
          total_published_announcements: Number(
            statsResponse?.stats?.total_published_announcements || 0,
          ),
          total_published_blog_posts: Number(
            statsResponse?.stats?.total_published_blog_posts || 0,
          ),
        });
        setPublishedBlogStats(
          Array.isArray(publishedBlogsResponse?.stats) ? publishedBlogsResponse.stats : [],
        );
      } catch (requestError) {
        if (!active) return;
        if (isAuthError(requestError)) {
          handleAuthFailure();
          return;
        }
        setError(requestError?.message || "Failed to load dashboard data");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadStats();

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="space-y-6">
      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 sm:p-8">
        <h1 className="text-3xl sm:text-4xl font-black text-secondary tracking-tight">
          Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Quick overview of operations, engagement, and workflow performance.
        </p>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-100 rounded-2xl px-5 py-4 text-sm font-semibold text-red-600">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {loading ? (
          <div className="sm:col-span-2 xl:col-span-3 bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <CircularLoader label="Loading dashboard stats..." />
          </div>
        ) : (
          statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.key}
                className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-500">{stat.label}</p>
                  <span className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </span>
                </div>
                <p className="mt-4 text-4xl font-black text-secondary tracking-tight">
                  {stats[stat.key]}
                </p>
              </div>
            );
          })
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6">
          <h2 className="text-xl font-black text-secondary tracking-tight">
            Blogs Published In The Last 6 Months
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Total number of blogs published in each of the last 6 months, including the current month.
          </p>
          {publishedBlogStats.length === 0 ? (
            <div className="mt-6 h-56 rounded-2xl border border-dashed border-gray-200 flex items-center justify-center text-sm font-semibold text-gray-500">
              No published blog data available.
            </div>
          ) : (
            <>
              <div className="mt-6 rounded-2xl border border-slate-100 bg-[linear-gradient(180deg,rgba(148,209,44,0.08),rgba(255,255,255,0))] p-4">
                <svg
                  viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
                  className="w-full h-auto overflow-visible"
                  role="img"
                  aria-label="Line chart showing published blog posts over the last 6 months"
                >
                  <defs>
                    <linearGradient id="publishedBlogsArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(148, 209, 44, 0.32)" />
                      <stop offset="100%" stopColor="rgba(148, 209, 44, 0.02)" />
                    </linearGradient>
                  </defs>

                  {yAxisTicks.map((tick) => (
                    <g key={`${tick.value}-${tick.y}`}>
                      <line
                        x1={CHART_PADDING.left}
                        y1={tick.y}
                        x2={CHART_WIDTH - CHART_PADDING.right}
                        y2={tick.y}
                        stroke="rgba(0, 61, 91, 0.10)"
                        strokeDasharray="4 6"
                      />
                      <text
                        x={CHART_PADDING.left - 10}
                        y={tick.y + 4}
                        textAnchor="end"
                        fontSize="11"
                        fill="rgba(0, 61, 91, 0.65)"
                      >
                        {tick.value}
                      </text>
                    </g>
                  ))}

                  <line
                    x1={CHART_PADDING.left}
                    y1={CHART_PADDING.top + chartInnerHeight}
                    x2={CHART_WIDTH - CHART_PADDING.right}
                    y2={CHART_PADDING.top + chartInnerHeight}
                    stroke="rgba(0, 61, 91, 0.18)"
                  />

                  {areaPath ? (
                    <path d={areaPath} fill="url(#publishedBlogsArea)" />
                  ) : null}

                  {linePath ? (
                    <path
                      d={linePath}
                      fill="none"
                      stroke="var(--secondary)"
                      strokeWidth="3"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                  ) : null}

                  {chartPoints.map((point) => (
                    <g key={point.month_key}>
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r="6"
                        fill="white"
                        stroke="var(--secondary)"
                        strokeWidth="3"
                      />
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r="3"
                        fill="var(--primary)"
                      />
                      <text
                        x={point.x}
                        y={point.y - 14}
                        textAnchor="middle"
                        fontSize="12"
                        fontWeight="700"
                        fill="var(--secondary)"
                      >
                        {point.value}
                      </text>
                      <text
                        x={point.x}
                        y={CHART_HEIGHT - 14}
                        textAnchor="middle"
                        fontSize="11"
                        fill="rgba(0, 61, 91, 0.7)"
                      >
                        {point.month_label}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
