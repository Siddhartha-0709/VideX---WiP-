import Stream from "../models/streams.model.js";
import RtmpHost from "../models/rtmp-host.model.js";
import crypto from "crypto";


// Helper: Get least loaded RTMP host
async function getLeastLoadedHost() {
  return await RtmpHost
    .findOne({ isActive: true })
    .sort({ registeredStreams: 1 });
}

const createStream = async (req, res) => {
  try {
    const { title, description, thumbnailUrl, streamStartTime } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title & description required" });
    }

    const hostDoc = await getLeastLoadedHost();
    if (!hostDoc) {
      return res.status(503).json({ message: "No RTMP hosts available" });
    }

    const streamKey = crypto.randomBytes(16).toString("hex");

    const stream = await Stream.create({
      title,
      description,
      streamKey,
      rtmpUrl: hostDoc.rtmpBaseUrl,
      hlsUrl: `${hostDoc.hlsBaseUrl}/${streamKey}.m3u8`,
      streamStartTime: streamStartTime || null,
      thumbnailUrl: thumbnailUrl || "",
      status: "idle"
    });

    await RtmpHost.updateOne(
      { _id: hostDoc._id },
      { $inc: { registeredStreams: 1 } }
    );

    res.status(201).json({
      id: stream._id,
      streamKey,
      assignedHost: hostDoc.host,
      rtmpUrl: stream.rtmpUrl,
      hlsUrl: stream.hlsUrl
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const getStreamByKey = async (req, res) => {
  try {
    const { streamKey } = req.query;

    const stream = await Stream.findOne({ streamKey });
    if (!stream) {
      return res.status(404).json({ message: "Stream not found" });
    }

    res.status(200).json(stream);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const getAllStreams = async (req, res) => {
  try {
    const streams = await Stream.find().sort({ createdAt: -1 });
    res.status(200).json(streams);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const addRtmpHost = async (req, res) => {
  try {
    const { host, rtmpBaseUrl, hlsBaseUrl } = req.body;

    if (!host || !rtmpBaseUrl || !hlsBaseUrl) {
      return res.status(400).json({ message: "All fields required" });
    }

    const newHost = await RtmpHost.create({
      host,
      rtmpBaseUrl,
      hlsBaseUrl,
      registeredStreams: 0,
      isActive: true
    });

    res.status(201).json({
      message: "RTMP host added successfully",
      host: newHost
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export {
  createStream,
  getStreamByKey,
  getAllStreams,
  addRtmpHost
};
