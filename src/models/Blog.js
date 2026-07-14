import { query } from "@/lib/server/db";

class Blog {
  static async createBlog({ title, slug, metaDescription, featuredImage, content, status, scheduledPublishTime }) {
    const sql = `
      INSERT INTO blogs (
        title,
        slug,
        meta_description,
        featured_image,
        content,
        status,
        scheduled_publish_time,
        publish_time,
        created_at,
        updated_at
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6::varchar,
        $7::timestamp,
        CASE WHEN $6::varchar = 'published' THEN CURRENT_TIMESTAMP ELSE NULL END,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      )
      RETURNING *
    `;

    const values = [title, slug, metaDescription, featuredImage, content, status, scheduledPublishTime];
    const result = await query(sql, values);
    return result.rows[0];
  }

  static async getAllBlogs() {
    const sql = `SELECT * FROM blogs ORDER BY id DESC`;
    const result = await query(sql);
    return result.rows;
  }

  static async getBlogById(id) {
    const sql = `SELECT * FROM blogs WHERE id = $1`;
    const result = await query(sql, [id]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  static async getBlogBySlug(slug) {
    const sql = `SELECT * FROM blogs WHERE LOWER(slug) = LOWER($1)`;
    const result = await query(sql, [slug]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  static async updateBlog(id, { title, slug, metaDescription, featuredImage, content, status, scheduledPublishTime }) {
    const sql = `
      UPDATE blogs
      SET
        title = $1,
        slug = $2,
        meta_description = $3,
        featured_image = $4,
        content = $5,
        status = $6::varchar,
        scheduled_publish_time = $7::timestamp,
        publish_time = CASE
          WHEN $6::varchar = 'published' AND publish_time IS NULL THEN CURRENT_TIMESTAMP
          WHEN $6::varchar = 'scheduled' THEN NULL
          ELSE publish_time
        END,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING *
    `;

    const values = [title, slug, metaDescription, featuredImage, content, status, scheduledPublishTime, id];
    const result = await query(sql, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  static async updateBlogStatus(id, status, scheduledPublishTime) {
    const sql = `
      UPDATE blogs
      SET
        status = $1::varchar,
        scheduled_publish_time = $2::timestamp,
        publish_time = CASE
          WHEN $1::varchar = 'published' AND publish_time IS NULL THEN CURRENT_TIMESTAMP
          WHEN $1::varchar = 'scheduled' THEN NULL
          ELSE publish_time
        END,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `;

    const result = await query(sql, [status, scheduledPublishTime, id]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  static async getDueScheduledBlogs() {
    const sql = `
      SELECT *
      FROM blogs
      WHERE status = 'scheduled'
        AND scheduled_publish_time <= CURRENT_TIMESTAMP
      ORDER BY scheduled_publish_time ASC
    `;

    const result = await query(sql);
    return result.rows;
  }

  static async markAsPublished(id) {
    const sql = `
      UPDATE blogs
      SET
        status = 'published',
        scheduled_publish_time = NULL,
        publish_time = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
        AND status = 'scheduled'
        AND scheduled_publish_time <= CURRENT_TIMESTAMP
      RETURNING *
    `;

    const result = await query(sql, [id]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  static async deleteBlog(id) {
    const sql = `DELETE FROM blogs WHERE id = $1 RETURNING *`;
    const result = await query(sql, [id]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }
}

export default Blog;
