import mongoose from "mongoose";

export const EVENT_STATUSES = ["draft", "published", "cancelled"];

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 120,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },
    date: { type: Date, required: true },
    capacity: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: "La capacidad debe ser un número entero",
      },
    },
    location: {
      type: String,
      trim: true,
      maxlength: 200,
      default: "",
    },
    status: {
      type: String,
      enum: EVENT_STATUSES,
      default: "draft",
      required: true,
    },
    // El organizador se referencia: evita duplicar datos y permite roles.
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// GET /api/events ordena por fecha: el índice evita el sort en memoria.
eventSchema.index({ date: 1 });

/**
 * Representación pública de un evento (sin datos internos de Mongoose).
 */
export function toPublicEvent(event) {
  return {
    id: String(event._id ?? event.id),
    title: event.title,
    description: event.description,
    date:
      event.date instanceof Date ? event.date.toISOString() : event.date,
    capacity: event.capacity,
    location: event.location,
    status: event.status,
    organizer: event.organizer ? String(event.organizer) : null,
  };
}

const Event = mongoose.model("Event", eventSchema);

export default Event;
