import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Event name is required'],
    },
    date: {
        type: Date,
        required: [true, 'Event date is required'],
    },
    location: String,
    description: String,
    capacity: {
        type: Number,
        default: 10,
        min : [1, 'Capacity must be at least 1'],
    },
    
}, {
    timestamps: true,
});

const Event = mongoose.model("Event", eventSchema, "events");

export default Event;
