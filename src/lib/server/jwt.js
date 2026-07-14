import jwt from "jsonwebtoken";

export const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);

export const createToken = async (data) =>
  jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "1h" });
