import { query } from "@/lib/server/db";

class ActivityLog {
  static async create({ action, actor, isSuccessful, statusCode, method, path }) {
    const sql = `
      INSERT INTO activity_logs (action, actor, performed_at, is_successful, status_code, http_method, endpoint)
      VALUES ($1, $2, CURRENT_TIMESTAMP, $3, $4, $5, $6)
    `;

    const values = [action, actor, isSuccessful, statusCode, method, path];
    await query(sql, values);
  }

  static async getAll({ page, limit }) {
    const offset = (page - 1) * limit;
    const sql = `
      SELECT id, action, actor, performed_at, is_successful, status_code, http_method, endpoint
      FROM activity_logs
      ORDER BY performed_at DESC, id DESC
      LIMIT $1 OFFSET $2
    `;

    const countSql = `SELECT COUNT(*)::int AS total FROM activity_logs`;

    const [listResult, countResult] = await Promise.all([
      query(sql, [limit, offset]),
      query(countSql),
    ]);

    return {
      logs: listResult.rows,
      total: countResult.rows[0]?.total || 0,
    };
  }
}

export default ActivityLog;
