import { query } from "@/lib/server/db";

class Service {
  static async createService(serviceName, serviceDescription, visibilityStatus) {
    const sql = `
      INSERT INTO services (service_name, service_description, visibility_status, created_at, updated_at)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *
    `;
    const values = [serviceName, serviceDescription, visibilityStatus];
    const result = await query(sql, values);
    return result.rows[0];
  }

  static async getAllServices() {
    const sql = `SELECT * FROM services ORDER BY id DESC`;
    const result = await query(sql);
    return result.rows;
  }

  static async getServiceById(id) {
    const sql = `SELECT * FROM services WHERE id = $1`;
    const result = await query(sql, [id]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  static async getServiceByName(serviceName) {
    const sql = `SELECT * FROM services WHERE LOWER(service_name) = LOWER($1)`;
    const result = await query(sql, [serviceName]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  static async updateService(id, serviceName, serviceDescription, visibilityStatus) {
    const sql = `
      UPDATE services
      SET service_name = $1,
          service_description = $2,
          visibility_status = $3,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *
    `;
    const values = [serviceName, serviceDescription, visibilityStatus, id];
    const result = await query(sql, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  static async deleteService(id) {
    const sql = `DELETE FROM services WHERE id = $1 RETURNING *`;
    const result = await query(sql, [id]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }
}

export default Service;
