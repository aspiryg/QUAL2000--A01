import mongoose from "mongoose";

const attendeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required for an attendee"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event reference is required for an attendee"],
    },
    registrationStatus: {
      type: String,
      enum: ["registered", "cancelled"],
      default: "registered",
    },
    checkedIn: {
      type: Boolean,
      default: false,
    },
    checkInTime: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// One attendee can only register once for a specific event, so we create a compound index on email and event
attendeeSchema.index({ email: 1, event: 1 }, { unique: true });
const Attendee = mongoose.model("Attendee", attendeeSchema, "attendees");

export default Attendee;
