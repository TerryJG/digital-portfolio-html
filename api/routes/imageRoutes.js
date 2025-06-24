import express from 'express';
import mongoose from 'mongoose';
import { Image } from "../models/imageSchema.js";

const router = express.Router();

// GET all images
router.get('/', async (req, res) => {
    try {
        const images = await Image.find({}).sort({ date: -1 });
        // console.log('Total images found:', images.length);
        res.status(200).json(images);
    } catch (error) {
        // console.error('Error in / route:', error);
        res.status(400).json({ error: error.message });
    }
});

// GET single image
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Not a valid ID' });
    }
    try {
        const image = await Image.findById(id);
        if (!image) {
            return res.status(404).json({ error: "Could not find image" });
        }
        res.status(200).json(image);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router;