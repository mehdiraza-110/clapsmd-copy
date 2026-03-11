"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar } from "lucide-react";
import { getBlogs } from "@/lib/authClient";

const SKELETON_ITEMS = 6;

function formatDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function BlogCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex flex-col animate-pulse">
      <div className="h-56 w-full bg-slate-100" />
      <div className="p-8 flex flex-col flex-grow">
        <div className="h-4 w-36 rounded bg-slate-200 mb-6" />
        <div className="h-8 w-full rounded bg-slate-200 mb-3" />
        <div className="h-8 w-3/4 rounded bg-slate-200 mb-6" />
        <div className="space-y-3 mb-8 flex-grow">
          <div className="h-4 w-full rounded bg-slate-200" />
          <div className="h-4 w-full rounded bg-slate-200" />
          <div className="h-4 w-5/6 rounded bg-slate-200" />
        </div>
        <div className="h-5 w-36 rounded bg-slate-200" />
      </div>
    </div>
  );
}

export default function BlogIndexSection() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadBlogs() {
      setLoading(true);
      setError("");

      try {
        const response = await getBlogs();
        if (!active) return;

        const publishedBlogs = Array.isArray(response?.blogs)
          ? response.blogs
              .filter((blog) => (blog?.status || "").toLowerCase() === "published")
              .sort((left, right) => {
                const leftValue = new Date(left?.publish_time || left?.created_at || 0).getTime();
                const rightValue = new Date(right?.publish_time || right?.created_at || 0).getTime();
                return rightValue - leftValue;
              })
          : [];

        setBlogs(publishedBlogs);
      } catch (requestError) {
        if (!active) return;
        setError(requestError?.message || "Failed to load blog posts");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadBlogs();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {Array.from({ length: SKELETON_ITEMS }).map((_, index) => (
          <BlogCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!blogs.length) {
    return (
      <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center shadow-sm">
        <p className="text-gray-500 text-lg">
          {error || "No resources available at the moment. Please check back soon."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {blogs.map((blog) => (
        <article
          key={blog.id ?? blog.slug}
          className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
        >
          {blog.featured_image ? (
            <div className="relative h-56 w-full overflow-hidden bg-slate-100">
              <Image
                src={blog.featured_image}
                alt={blog.title || "Blog featured image"}
                fill
                className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          ) : null}

          <div className="p-8 flex flex-col flex-grow">
            <div className="flex items-center text-primary-darker/50 text-xs font-black uppercase tracking-widest mb-6">
              <Calendar className="w-4 h-4 mr-2" />
              {formatDate(blog.publish_time || blog.created_at) || "Recently Published"}
            </div>

            <h2 className="text-2xl font-black text-secondary mb-4 leading-tight group-hover:text-primary transition-colors">
              <Link href={`/blog/${String(blog.slug || "").toLowerCase()}`}>
                {blog.title}
              </Link>
            </h2>

            {blog.meta_description ? (
              <p className="text-gray-600 mb-8 flex-grow leading-relaxed font-medium line-clamp-3">
                {blog.meta_description}
              </p>
            ) : null}

            <Link
              href={`/blog/${String(blog.slug || "").toLowerCase()}`}
              className="inline-flex items-center text-primary font-black hover:gap-3 transition-all group/link mt-auto text-lg"
            >
              Read Full Article
              <ArrowRight className="ml-2 w-5 h-5 group-hover/link:translate-x-1 transition-transform" />
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
