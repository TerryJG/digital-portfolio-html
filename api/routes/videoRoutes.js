import express from 'express';
import mongoose from 'mongoose';
import { Video } from "../models/videoSchema.js";

const router = express.Router();

// GET all videos
router.get('/', async (req, res) => {
    try {
        const videos = await Video.find({}).sort({ 'data-date': -1 });
        // console.log('Total videos found:', videos.length);
        res.status(200).json(videos);
    } catch (error) {
        // console.error('Error in / route:', error);
        res.status(400).json({ error: error.message });
    }
});

// GET featured videos
router.get('/featured', async (req, res) => {
    try {
        // Query for both boolean true and string "true"
        const featuredVideos = await Video.find({
            isFeatured: true
        }).sort({ 'data-date': -1 });

        // console.log('Number of featured videos found:', featuredVideos.length);

        res.status(200).json(featuredVideos);
    } catch (error) {
        // console.error('Error in /featured route:', error);
        res.status(400).json({ error: error.message });
    }
});

// GET single video
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Not a valid ID' });
    }
    try {
        const video = await Video.findById(id);
        if (!video) {
            return res.status(404).json({ error: "Could not find video" });
        }
        res.status(200).json(video);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router;