import { query, supabaseDb } from "@/lib/server/db";

const PLACEMENTS = [
  {
    key: "hero_slideshow",
    label: "Homepage Hero Slideshow",
    description: "The rotating image slideshow at the top of the homepage.",
    multiple: true,
    maxImages: 8,
    recommendedDimensions: "1600 x 900px (16:9 landscape)",
    hasCaption: false,
  },
  {
    key: "meet_the_doctor",
    label: "Meet the Doctor (Homepage)",
    description: 'Dr. Farri\'s photo in the "Meet Our Specialist" section on the homepage.',
    multiple: false,
    maxImages: 1,
    recommendedDimensions: "4:5 portrait",
    hasCaption: false,
  },
  {
    key: "about_doctor",
    label: "About Page Photo",
    description: "Dr. Farri's large photo on the About page.",
    multiple: false,
    maxImages: 1,
    recommendedDimensions: "Tall portrait",
    hasCaption: false,
  },
  {
    key: "about_bio_photo",
    label: "About Page Bio Tab Photo",
    description: 'Dr. Farri\'s photo in the "Bio" tab on the About page.',
    multiple: false,
    maxImages: 1,
    recommendedDimensions: "4:5 portrait",
    hasCaption: false,
  },
  {
    key: "about_experience_photo",
    label: "About Page Experience Tab Photo",
    description: 'Dr. Farri\'s photo in the "Experience" tab on the About page.',
    multiple: false,
    maxImages: 1,
    recommendedDimensions: "4:5 portrait",
    hasCaption: false,
  },
  {
    key: "pft_lab_logo",
    label: "PFT Lab Page Logo",
    description: 'The "Pulmonary Lab Services" logo in the PFT Lab page hero section.',
    multiple: false,
    maxImages: 1,
    recommendedDimensions: "Logo, transparent background, ~300 x 167px",
    hasCaption: false,
  },
  {
    key: "pft_lab_hero_photo",
    label: "PFT Lab Page Hero Photo",
    description: "The featured photo next to the intro text in the PFT Lab page hero section.",
    multiple: false,
    maxImages: 1,
    recommendedDimensions: "4:3 landscape",
    hasCaption: false,
  },
  {
    key: "pft_lab_gallery",
    label: "PFT Lab Page Gallery",
    description: "The two-column photo grid on the PFT Lab page (2 stacked pairs).",
    multiple: true,
    maxImages: 4,
    recommendedDimensions: "16:10 landscape",
    hasCaption: false,
  },
  {
    key: "insurance_logos",
    label: "Insurance Logos",
    description: "Accepted insurance carrier logos shown on the Insurance & Billing page.",
    multiple: true,
    maxImages: 40,
    recommendedDimensions: "Small logo tile, transparent background",
    hasCaption: true,
    captionLabel: "Insurer Name",
  },
];

const PLACEMENT_KEYS = PLACEMENTS.map((p) => p.key);

class GalleryImage {
  static getPlacements() {
    return PLACEMENTS;
  }

  static isValidPlacement(key) {
    return PLACEMENT_KEYS.includes(key);
  }

  static getPlacementConfig(key) {
    return PLACEMENTS.find((p) => p.key === key) || null;
  }

  static async createImage({ placement, imageUrl, altText, caption, displayOrder, visibilityStatus }) {
    const sql = `
      INSERT INTO gallery_images (placement, image_url, alt_text, caption, display_order, visibility_status, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *
    `;
    const values = [placement, imageUrl, altText, caption || null, displayOrder, visibilityStatus];
    const result = await query(sql, values);
    return result.rows[0];
  }

  static async getAllImages(filters = {}) {
    const values = [];
    const conditions = [];

    if (filters.placement) {
      values.push(filters.placement);
      conditions.push(`placement = $${values.length}`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const sql = `
      SELECT *
      FROM gallery_images
      ${whereClause}
      ORDER BY placement ASC, display_order ASC, id ASC
    `;

    const result = await query(sql, values);
    return result.rows;
  }

  static async getPublicImages() {
    const sql = `
      SELECT *
      FROM gallery_images
      WHERE visibility_status = TRUE
      ORDER BY placement ASC, display_order ASC, id ASC
    `;
    const result = await query(sql);
    return result.rows;
  }

  static async getImageById(id) {
    const sql = `SELECT * FROM gallery_images WHERE id = $1`;
    const result = await query(sql, [id]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  static async countByPlacement(placement) {
    const sql = `SELECT COUNT(*)::int AS count FROM gallery_images WHERE placement = $1`;
    const result = await query(sql, [placement]);
    return result.rows[0].count;
  }

  static async getMaxDisplayOrder(placement) {
    const sql = `SELECT COALESCE(MAX(display_order), -1) AS max_order FROM gallery_images WHERE placement = $1`;
    const result = await query(sql, [placement]);
    return result.rows[0].max_order;
  }

  static async updateImage(id, { imageUrl, altText, caption, visibilityStatus }) {
    const sql = `
      UPDATE gallery_images
      SET image_url = $1,
          alt_text = $2,
          caption = $3,
          visibility_status = $4,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *
    `;
    const values = [imageUrl, altText, caption || null, visibilityStatus, id];
    const result = await query(sql, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  static async deleteImage(id) {
    const sql = `DELETE FROM gallery_images WHERE id = $1 RETURNING *`;
    const result = await query(sql, [id]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  static async reorderImages(placement, orderedIds) {
    const client = await supabaseDb.connect();
    try {
      await client.query("BEGIN");
      const updated = [];
      for (let index = 0; index < orderedIds.length; index += 1) {
        const result = await client.query(
          `UPDATE gallery_images
           SET display_order = $1,
               updated_at = CURRENT_TIMESTAMP
           WHERE id = $2 AND placement = $3
           RETURNING *`,
          [index, orderedIds[index], placement]
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

export default GalleryImage;
