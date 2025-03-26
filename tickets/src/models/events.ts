import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface EventsAttrs {
  name: string;
  description: string;
  type: string;
  genre: string;
  language: string;
  duration: number;
  date: Date;
  startDate: Date;
  endDate: Date;
  location: Object;
  performers: Object;
  userId: string;
}
interface EventDoc extends mongoose.Document {
  name: string;
  description: string;
  type: string;
  genre: string;
  language: string;
  duration: number;
  date: Date;
  startDate: Date;
  endDate: Date;
  location: Object;
  performers: Object;
  userId: string;
}

interface EventModel extends mongoose.Model<EventDoc> {
  build(attrs: EventsAttrs): EventDoc;
}

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Name of the event (movie, concert, etc.)
  description: { type: String, required: true }, // Event description
  type: {
    type: String,
    required: true,
    enum: ["movie", "concert", "play", "sports", "other"],
  },
  genre: { type: String }, // Genre/category (e.g., Action, Music, Drama)
  language: { type: String }, // Language of the event (optional)
  duration: { type: Number }, // Duration in minutes (if applicable)
  date: { type: Date }, // Single date for one-time events like concerts
  startDate: { type: Date }, // Start date for multi-day events (e.g., movies or exhibitions)
  endDate: { type: Date }, // End date for multi-day events
  location: {
    address: { type: String, required: true }, // Address of the event
    city: { type: String, required: true }, // City where the event takes place
    state: { type: String }, // State (if applicable)
    country: { type: String, required: true }, // Country
  },
  performers: [{ type: String }],
  userId: { type: String, require: true },
});

eventSchema.set("versionKey", "version");
eventSchema.plugin(updateIfCurrentPlugin);

eventSchema.statics.build = (attrs: EventsAttrs) => {
  return new Event(attrs);
};

const Event = mongoose.model<EventDoc, EventModel>("Event", eventSchema);

export { Event };
