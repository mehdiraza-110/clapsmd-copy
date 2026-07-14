import { query, supabaseDb } from "@/lib/server/db";

class ClinicHour {
  static async getAllClinicHours() {
    const sql = `SELECT * FROM clinic_hours ORDER BY day_order ASC`;
    const result = await query(sql);
    return result.rows;
  }

  static async getClinicHourById(id) {
    const sql = `SELECT * FROM clinic_hours WHERE id = $1`;
    const result = await query(sql, [id]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  static async updateClinicHour(id, openTime, closeTime, isClosed) {
    const sql = `
      UPDATE clinic_hours
      SET open_time  = $1,
          close_time = $2,
          is_closed  = $3,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *
    `;
    const values = [openTime, closeTime, isClosed, id];
    const result = await query(sql, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  static async bulkUpdateClinicHours(hours) {
    // hours: [{ id, open_time, close_time, is_closed }, ...]
    const client = await supabaseDb.connect();
    try {
      await client.query("BEGIN");
      const updated = [];
      for (const hour of hours) {
        const { id, open_time, close_time, is_closed } = hour;
        const result = await client.query(
          `UPDATE clinic_hours
           SET open_time  = $1,
               close_time = $2,
               is_closed  = $3,
               updated_at = CURRENT_TIMESTAMP
           WHERE id = $4
           RETURNING *`,
          [open_time, close_time, is_closed, id]
        );
        if (result.rows.length > 0) updated.push(result.rows[0]);
      }
      await client.query("COMMIT");
      return updated;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }
}

export default ClinicHour;
