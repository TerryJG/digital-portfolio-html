import mongoose from 'mongoose';

const categoryInfoSchema = new mongoose.Schema({
  title: { type: String, required: true },
    abbreviatedTitle: { type: String, required: true },
    menuTitle: { type: String, required: true },
    primaryColor: { type: String, required: true },

    accentColor: { type: String, required: true },
    description: { type: String, required: true },
    img: { type: String, required: true },
    lastUpdated: { type: String, required: true },
    isArchived: { type: Boolean, required: true },

}, {
    timestamps: true,
    collection: 'categoryInfo'
});

export const categoryInfo = mongoose.model('categoryInfo', categoryInfoSchema);