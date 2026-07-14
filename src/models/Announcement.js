import { query } from "@/lib/server/db";

class Announcement {
  static async createAnnouncement({ title, message, status, scheduledTime, expiryTime }) {
    const sql = `
      INSERT INTO announcements (
        title,
        message,
        status,
        scheduled_time,
        expiry_time,
        publish_time,
        created_at,
        updated_at
      )
      VALUES (
        $1,
        $2,
        $3::varchar,
        $4::timestamptz,
        $5::timestamptz,
        CASE WHEN $3::varchar = 'published' THEN CURRENT_TIMESTAMP ELSE NULL END,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      )
      RETURNING *
    `;

    const values = [title, message, status, scheduledTime, expiryTime];
    const result = await query(sql, values);
    return result.rows[0];
  }

  static async getAllAnnouncements() {
    const sql = `SELECT * FROM announcements ORDER BY id DESC`;
    const result = await query(sql);
    return result.rows;
  }

  static async getActiveAnnouncements() {
    const sql = `
      SELECT *
      FROM announcements
      WHERE status = 'published'
        AND (expiry_time IS NULL OR expiry_time > CURRENT_TIMESTAMP)
      ORDER BY id DESC
    `;
    const result = await query(sql);
    return result.rows;
  }

  static async getAnnouncementById(id) {
    const sql = `SELECT * FROM announcements WHERE id = $1`;
    const result = await query(sql, [id]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  static async updateAnnouncement(id, { title, message, status, scheduledTime, expiryTime }) {
    const sql = `
      UPDATE announcements
      SET
        title = $1,
        message = $2,
        status = $3::varchar,
        scheduled_time = $4::timestamptz,
        expiry_time = $5::timestamptz,
        publish_time = CASE
          WHEN $3::varchar = 'published' AND publish_time IS NULL THEN CURRENT_TIMESTAMP
          WHEN $3::varchar = 'scheduled' THEN NULL
          ELSE publish_time
        END,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *
    `;

    const values = [title, message, status, scheduledTime, expiryTime, id];
    const result = await query(sql, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  static async deleteAnnouncement(id) {
    const sql = `DELETE FROM announcements WHERE id = $1 RETURNING *`;
    const result = await query(sql, [id]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  static async getDueScheduledAnnouncements() {
    const sql = `
      SELECT *
      FROM announcements
      WHERE status = 'scheduled'
        AND scheduled_time <= CURRENT_TIMESTAMP
        AND (expiry_time IS NULL OR expiry_time > CURRENT_TIMESTAMP)
      ORDER BY scheduled_time ASC
    `;

    const result = await query(sql);
    return result.rows;
  }

  static async getDueAnnouncementsForExpiry() {
    const sql = `
      SELECT *
      FROM announcements
      WHERE status IN ('published', 'scheduled')
        AND expiry_time IS NOT NULL
        AND expiry_time <= CURRENT_TIMESTAMP
      ORDER BY expiry_time ASC
    `;

    const result = await query(sql);
    return result.rows;
  }

  static async markAsPublished(id) {
    const sql = `
      UPDATE announcements
      SET
        status = 'published',
        scheduled_time = NULL,
        publish_time = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
        AND status = 'scheduled'
        AND scheduled_time <= CURRENT_TIMESTAMP
        AND (expiry_time IS NULL OR expiry_time > CURRENT_TIMESTAMP)
      RETURNING *
    `;

    const result = await query(sql, [id]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  static async markAsExpired(id) {
    const sql = `
      UPDATE announcements
      SET
        status = 'expired',
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
        AND status IN ('published', 'scheduled')
        AND expiry_time IS NOT NULL
        AND expiry_time <= CURRENT_TIMESTAMP
      RETURNING *
    `;

    const result = await query(sql, [id]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }
}

export default Announcement;
