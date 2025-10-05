import mongoose from 'mongoose';

const categoryInfoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    abbreviatedTitle: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    primaryColor: {
        type: String,
        required: true
    },
    accentColor: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imgSrc: {
        type: String,
        required: true
    },
    fallbackImgSrc: {
        type: String,
        default: ''
    },
    lastUpdated: {
        type: String,
        required: true
    },
    isArchived: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
  timestamps: true,
  collection: 'categoryInfo'
});

export const categoryInfo = mongoose.model('categoryInfo', categoryInfoSchema);