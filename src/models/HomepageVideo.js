import { query } from "@/lib/server/db";

class HomepageVideo {
  static async getVideo() {
    const sql = `SELECT * FROM homepage_video ORDER BY id DESC LIMIT 1`;
    const result = await query(sql);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  static async getPublicVideo() {
    const sql = `SELECT * FROM homepage_video WHERE visibility_status = TRUE ORDER BY id DESC LIMIT 1`;
    const result = await query(sql);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  static async createVideo({ videoUrl, title, visibilityStatus }) {
    const sql = `
      INSERT INTO homepage_video (video_url, title, visibility_status, created_at, updated_at)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *
    `;
    const values = [videoUrl, title || null, visibilityStatus];
    const result = await query(sql, values);
    return result.rows[0];
  }

  static async updateVideo(id, { title, visibilityStatus }) {
    const sql = `
      UPDATE homepage_video
      SET title = $1,
          visibility_status = $2,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `;
    const values = [title || null, visibilityStatus, id];
    const result = await query(sql, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  static async deleteVideo(id) {
    const sql = `DELETE FROM homepage_video WHERE id = $1 RETURNING *`;
    const result = await query(sql, [id]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }
}

export default HomepageVideo;
