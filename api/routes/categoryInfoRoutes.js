import express from 'express';
import mongoose from 'mongoose';
import { categoryInfo as CategoryInfo } from "../models/categoryInfoSchema.js";

const router = express.Router();

// GET all categoryInfo
router.get('/', async (req, res) => {
    try {
        const categories = await CategoryInfo.find({}).sort({ 'lastUpdated': 1 });
        res.status(200).json(categories);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// GET single category
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Not a valid ID' });
    }
    try {
        const category = await CategoryInfo.find(id);
        if (!category) {
            return res.status(404).json({ error: "Could not find category" });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router;