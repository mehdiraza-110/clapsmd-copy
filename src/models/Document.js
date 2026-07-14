import { query } from "@/lib/server/db";

const DOCUMENT_TYPES = ["consent_doc", "coinsurance_doc", "self_pay_agreement_doc", "self_pay_pricing"];

class Document {
  static getDocumentTypes() {
    return DOCUMENT_TYPES;
  }

  static async createDocument({ documentName, documentType, documentUrl, notes, visibilityStatus }) {
    const sql = `
      INSERT INTO documents (
        document_name,
        document_type,
        document_url,
        notes,
        visibility_status,
        created_at,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *
    `;

    const values = [documentName, documentType, documentUrl, notes, visibilityStatus];
    const result = await query(sql, values);
    return result.rows[0];
  }

  static async getAllDocuments(filters = {}) {
    const values = [];
    const conditions = [];

    if (filters.search) {
      values.push(`%${filters.search}%`);
      conditions.push(`(document_name ILIKE $${values.length} OR notes ILIKE $${values.length})`);
    }

    if (filters.documentType) {
      values.push(filters.documentType);
      conditions.push(`document_type = $${values.length}`);
    }

    if (typeof filters.visibilityStatus === "boolean") {
      values.push(filters.visibilityStatus);
      conditions.push(`visibility_status = $${values.length}`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const sql = `
      SELECT *
      FROM documents
      ${whereClause}
      ORDER BY id DESC
    `;

    const result = await query(sql, values);
    return result.rows;
  }

  static async getDocumentById(id) {
    const sql = `SELECT * FROM documents WHERE id = $1`;
    const result = await query(sql, [id]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  static async getDocumentByName(documentName) {
    const sql = `SELECT * FROM documents WHERE LOWER(document_name) = LOWER($1)`;
    const result = await query(sql, [documentName]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  static async updateDocument(id, { documentName, documentType, documentUrl, notes, visibilityStatus }) {
    const sql = `
      UPDATE documents
      SET
        document_name = $1,
        document_type = $2,
        document_url = $3,
        notes = $4,
        visibility_status = $5,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *
    `;

    const values = [documentName, documentType, documentUrl, notes, visibilityStatus, id];
    const result = await query(sql, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  static async deleteDocument(id) {
    const sql = `DELETE FROM documents WHERE id = $1 RETURNING *`;
    const result = await query(sql, [id]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }
}

export default Document;
