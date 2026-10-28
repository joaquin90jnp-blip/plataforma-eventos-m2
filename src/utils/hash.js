import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

/**
 * Hashea una contraseña en texto plano. Reutilizable por registro y login.
 * @param {string} plainPassword
 * @returns {Promise<string>} hash bcrypt
 */
export async function hashPassword(plainPassword) {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

/**
 * Compara una contraseña en texto plano contra un hash bcrypt.
 * @param {string} plainPassword
 * @param {string} passwordHash
 * @returns {Promise<boolean>}
 */
export async function verifyPassword(plainPassword, passwordHash) {
  if (typeof plainPassword !== "string" || typeof passwordHash !== "string") {
    return false;
  }
  return bcrypt.compare(plainPassword, passwordHash);
}

/**
 * bcrypt solo usa los primeros 72 bytes: más allá se trunca en silencio.
 * @param {string} plainPassword
 * @returns {boolean}
 */
export function isPasswordTooLong(plainPassword) {
  return bcrypt.truncates(String(plainPassword));
}
