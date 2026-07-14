import { query } from "@/lib/server/db";

class Route {
  static async createRoute(route) {
    const sql = `INSERT INTO routes (route) VALUES ($1) RETURNING *`;
    const result = await query(sql, [route]);
    return result.rows[0];
  }

  static async getAllRoutes() {
    const sql = `SELECT * FROM routes ORDER BY id ASC`;
    const result = await query(sql);
    return result.rows;
  }

  static async getRouteById(id) {
    const sql = `SELECT * FROM routes WHERE id = $1`;
    const result = await query(sql, [id]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  static async getRouteByPath(route) {
    const sql = `SELECT * FROM routes WHERE route = $1`;
    const result = await query(sql, [route]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  static async updateRoute(id, route) {
    const sql = `UPDATE routes SET route = $1 WHERE id = $2 RETURNING *`;
    const result = await query(sql, [route, id]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  static async deleteRoute(id) {
    const rolePermissionsCheck = await query("SELECT COUNT(*) FROM role_permissions WHERE route_id = $1", [id]);
    const rolePermissionsCount = parseInt(rolePermissionsCheck.rows[0].count, 10);

    if (rolePermissionsCount > 0) {
      return {
        canDelete: false,
        message: `Cannot delete route. It is assigned to ${rolePermissionsCount} role permission(s).`,
      };
    }

    const sql = `DELETE FROM routes WHERE id = $1 RETURNING *`;
    const result = await query(sql, [id]);
    return { canDelete: true, route: result.rows.length > 0 ? result.rows[0] : null };
  }
}

export default Route;
