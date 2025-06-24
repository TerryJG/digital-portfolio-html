import express from 'express';
import mongoose from 'mongoose';
import { Web } from "../models/webSchema.js";

const router = express.Router();

// GET all webItems
router.get('/', async (req, res) => {
    try {
        const webItems = await Web.find({}).sort({ date: -1 });
        console.log('Total webItems found:', webItems.length);
        res.status(200).json(webItems);
    } catch (error) {
        // console.error('Error in / route:', error);
        res.status(400).json({ error: error.message });
    }
});

// GET single webItem
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Not a valid ID' });
    }
    try {
        const webItem = await Web.findById(id);
        if (!webItem) {
            return res.status(404).json({ error: "Could not find webItem" });
        }
        res.status(200).json(webItem);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router;