import Video from '../models/video.model.js';

const createVideo = async (req, res) => {
    try {
        const { title, description, videoUrl, thumbnailUrl, duration } = req.body;
        const newVideo = new Video({ title, description, videoUrl, thumbnailUrl, duration });
        console.log(req.body)
        const savedVideo = await newVideo.save();
        res.status(201).json(savedVideo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getAllVideos = async (req, res) => {
    try {
        const videos = await Video.find();
        res.status(200).json(videos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const increaseViewCount = async (req, res) => {
    try{
        const videoUrl = req.query.videoUrl;
        const video = await Video.findOne({ videoUrl: videoUrl });
        if(!video){
            return res.status(404).json({ message: "Video not found" });
        }
        video.views += 1;
        const updatedVideo = await video.save();
        res.status(200).json(updatedVideo); 
    }catch(error){
        res.status(500).json({ message: error.message });
    }
}

export { createVideo, getAllVideos, increaseViewCount };