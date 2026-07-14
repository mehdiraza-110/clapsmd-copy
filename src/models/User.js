import { query } from "@/lib/server/db";
import { uploadToS3, deleteFromS3 } from "@/lib/server/s3";

class User {
  static async createUser(firstName, lastName, email, phone, passwordHash, profileImage, isVerified, isAdminUser) {
    const sql = `INSERT INTO users (first_name, last_name, email, phone, password_hash, profile_image, is_verified, is_admin_user, created_at, updated_at, is_deleted)
                   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, FALSE)
                   RETURNING *`;
    const values = [firstName, lastName, email, phone, passwordHash, profileImage, isVerified, isAdminUser];
    const result = await query(sql, values);
    const userId = result.rows[0].id;

    // Assign default role 'agent' to the new user
    const roleResult = await query("SELECT id FROM roles WHERE name = $1", ["agent"]);
    const roleId = roleResult.rows[0]?.id;
    if (roleId) {
      await query("INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)", [userId, roleId]);
    }

    return {
      id: result.rows[0].id,
      first_name: result.rows[0].first_name,
      last_name: result.rows[0].last_name,
      email: result.rows[0].email,
      phone: result.rows[0].phone,
      is_verified: result.rows[0].is_verified,
      is_admin_user: result.rows[0].is_admin_user,
      roles: [{ name: "agent" }],
    };
  }

  static async GetUserByEmail(email) {
    const sql = "SELECT * FROM users WHERE email = $1 AND is_admin_user = TRUE AND is_deleted = FALSE";
    const result = await query(sql, [email]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  static async GetUserById(id) {
    const sql = "SELECT * FROM users WHERE id = $1 AND is_admin_user = TRUE AND is_deleted = FALSE";
    const result = await query(sql, [id]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  static async GetRolesByUserId(userId) {
    const roleResult = await query(
      `
        SELECT r.name FROM user_roles ur
        JOIN roles r ON r.id = ur.role_id
        WHERE ur.user_id = $1
      `,
      [userId]
    );

    return roleResult.rows.map((r) => r.name);
  }

  static async GetRoutesByRoles(roles) {
    const routeResult = await query(
      `
        SELECT DISTINCT routes.route
        FROM role_permissions rp
        JOIN roles r ON r.id = rp.role_id
        JOIN routes ON rp.route_id = routes.id
        WHERE r.name = ANY($1)
      `,
      [roles]
    );

    return routeResult.rows.map((r) => r.route);
  }

  static async UpdateUserProfile(id, first_name, last_name, email, phone) {
    await query(`UPDATE users SET first_name = $1, last_name = $2, email = $3, phone = $4 WHERE id = $5`, [
      first_name,
      last_name,
      email,
      phone,
      id,
    ]);
    return { state: true, message: "Profile Update Successfully!" };
  }

  static async updateUserAvatar(id, userImage) {
    const userPreviousImage = await query(`SELECT profile_image FROM users WHERE id = $1`, [id]);
    const prevImage = userPreviousImage.rowCount > 0 ? userPreviousImage.rows[0]?.profile_image : null;
    if (prevImage) {
      await deleteFromS3(prevImage);
    }
    let pfp_image_url = "#";
    if (userImage) {
      pfp_image_url = await uploadToS3(userImage, "user_pfp");
    }
    await query(`UPDATE users SET profile_image = $1 WHERE id = $2`, [pfp_image_url, id]);

    return { state: true, message: "Avatar Updated Successfully!" };
  }
}

export default User;
