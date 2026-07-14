import { query } from "@/lib/server/db";

class PricingItem {
  static async createPricingItem(pricingItem, amount, displayOrder, notes, visibilityStatus) {
    const sql = `
      INSERT INTO pricing_items (pricing_item, amount, display_order, notes, visibility_status, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *
    `;
    const values = [pricingItem, amount, displayOrder, notes, visibilityStatus];
    const result = await query(sql, values);
    return result.rows[0];
  }

  static async getAllPricingItems(filters = {}) {
    const values = [];
    const conditions = [];

    if (filters.search) {
      values.push(`%${filters.search}%`);
      conditions.push(`(pricing_item ILIKE $${values.length} OR notes ILIKE $${values.length})`);
    }

    if (typeof filters.visibilityStatus === "boolean") {
      values.push(filters.visibilityStatus);
      conditions.push(`visibility_status = $${values.length}`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const sql = `
      SELECT *
      FROM pricing_items
      ${whereClause}
      ORDER BY display_order ASC, id DESC
    `;

    const result = await query(sql, values);
    return result.rows;
  }

  static async getPricingItemById(id) {
    const sql = `SELECT * FROM pricing_items WHERE id = $1`;
    const result = await query(sql, [id]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  static async getPricingItemByName(pricingItem) {
    const sql = `SELECT * FROM pricing_items WHERE LOWER(pricing_item) = LOWER($1)`;
    const result = await query(sql, [pricingItem]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  static async updatePricingItem(id, pricingItem, amount, displayOrder, notes, visibilityStatus) {
    const sql = `
      UPDATE pricing_items
      SET pricing_item = $1,
          amount = $2,
          display_order = $3,
          notes = $4,
          visibility_status = $5,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *
    `;
    const values = [pricingItem, amount, displayOrder, notes, visibilityStatus, id];
    const result = await query(sql, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  static async deletePricingItem(id) {
    const sql = `DELETE FROM pricing_items WHERE id = $1 RETURNING *`;
    const result = await query(sql, [id]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }
}

export default PricingItem;
