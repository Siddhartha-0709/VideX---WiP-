import mongoose from "mongoose";

const rtmpHostSchema = new mongoose.Schema({
  host: {
    type: String,
    required: true,
    unique: true
  },
  rtmpBaseUrl: {
    type: String,
    required: true
  },
  hlsBaseUrl: {
    type: String,
    required: true
  },
  registeredStreams: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const RtmpHost = mongoose.model("RtmpHost", rtmpHostSchema);

export default RtmpHost;
