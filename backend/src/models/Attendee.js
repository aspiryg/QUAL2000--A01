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
// attendeeSchema.index({ email: 1, event: 1 }, { unique: true });

/* 
  I decided to handle duplicate registration logic in the controller instead of relying on MongoDB unique index, 
  because of the assignment actually requires unit testing of the duplicate registration logic. and it's easier and
  more flexible to handle it in the controller, also it allows us to return a more user-friendly error message instead of a MongoDB error.
*/
const Attendee = mongoose.model("Attendee", attendeeSchema, "attendees");

export default Attendee;
