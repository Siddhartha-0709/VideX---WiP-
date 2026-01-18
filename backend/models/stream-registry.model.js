import mongoose from "mongoose";

const streamRegistrySchema = new mongoose.Schema({
    streamKey: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: Boolean,
        default: false
    },
    host: {
        type: String,
        default: ""
    },
    startedAt: {
        type: Date
    }
}, { timestamps: true });

const StreamRegistry = mongoose.model("StreamRegistry", streamRegistrySchema);

export default StreamRegistry;