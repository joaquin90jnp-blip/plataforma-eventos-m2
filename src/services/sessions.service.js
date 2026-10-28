import * as usersRepository from "../repositories/users.repository.js";
import { hashPassword, isPasswordTooLong } from "../utils/hash.js";
import { toPublicUser } from "../models/User.js";
import { httpError } from "../utils/httpError.js";
import {
  isEmptyValue,
  isValidEmail,
  normalizeEmail,
  MIN_PASSWORD_LENGTH,
} from "../utils/validation.js";

/**
 * Registra un usuario nuevo. El rol siempre es "user": nunca se toma del body.
 */
export async function registerUser(input) {
  const { first_name, last_name, email, password } = input ?? {};

  if (
    isEmptyValue(first_name) ||
    isEmptyValue(last_name) ||
    isEmptyValue(email) ||
    isEmptyValue(password)
  ) {
    throw httpError(400, "Faltan campos obligatorios");
  }

  const normalizedEmail = normalizeEmail(email);
  if (!isValidEmail(normalizedEmail)) {
    throw httpError(400, "Email inválido");
  }

  if (String(password).length < MIN_PASSWORD_LENGTH) {
    throw httpError(
      400,
      `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`,
    );
  }

  if (isPasswordTooLong(password)) {
    throw httpError(400, "La contraseña no puede superar los 72 bytes");
  }

  const existing = await usersRepository.findByEmail(normalizedEmail);
  if (existing) {
    throw httpError(409, "El email ya está registrado");
  }

  const passwordHash = await hashPassword(String(password));

  try {
    const user = await usersRepository.createUser({
      first_name: String(first_name).trim(),
      last_name: String(last_name).trim(),
      email: normalizedEmail,
      password: passwordHash,
      role: "user",
    });

    return toPublicUser(user);
  } catch (error) {
    // Condición de carrera: el índice único de email rechazó el insert.
    if (isDuplicateEmailError(error)) {
      throw httpError(409, "El email ya está registrado");
    }
    throw error;
  }
}

export function isDuplicateEmailError(error) {
  return error?.code === 11000;
}
