import mongoose from "mongoose";

const streamSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    streamKey: {
      type: String,
      required: true,
      unique: true,
    },
    streamStartTime: {
      type: Date,
    },
    streamEndTime: {
      type: Date,
    },
    thumbnailUrl: {
      type: String,
    },
    rtmpUrl: {
      type: String,
      required: true,
    },
    hlsUrl: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["live", "idle", "ended"],
      default: "idle",
    },
  },
  { timestamps: true }
);

const Stream = mongoose.model("Stream", streamSchema);

export default Stream;