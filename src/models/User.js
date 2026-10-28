import mongoose from "mongoose";

export const USER_ROLES = ["user", "organizer", "admin"];

const userSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: USER_ROLES,
      default: "user",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

userSchema.set("toJSON", {
  transform(doc, ret) {
    delete ret.password;
    return ret;
  },
});

userSchema.set("toObject", {
  transform(doc, ret) {
    delete ret.password;
    return ret;
  },
});

/**
 * Representación pública de un usuario: nunca incluye la contraseña.
 */
export function toPublicUser(user) {
  return {
    id: String(user._id ?? user.id),
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    role: user.role,
  };
}

const User = mongoose.model("User", userSchema);

export default User;
