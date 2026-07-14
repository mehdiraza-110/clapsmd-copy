import Blog from "@/models/Blog";

export async function publishDueBlogs() {
  const published = [];

  const dueBlogs = await Blog.getDueScheduledBlogs();
  for (const blog of dueBlogs) {
    try {
      const result = await Blog.markAsPublished(blog.id);
      if (result) {
        console.log(`[blog-cron] Published blog #${blog.id}`);
        published.push(blog.id);
      }
    } catch (err) {
      console.error(`[blog-cron] Failed to publish blog #${blog.id}:`, err.message);
    }
  }

  return { published };
}
