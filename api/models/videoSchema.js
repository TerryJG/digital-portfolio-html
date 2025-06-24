import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
    dataFancybox: { type: String, },
    contentType: { type: String, required: true },
    itemType: { type: String },
    category: { type: String, required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    icons: [{ type: String }],
    'data-date': { type: String, required: true },
    title: { type: String, required: true },
    subTitle: { type: String },
    isFeatured: { type: Boolean, required: true },
    isArchived: { type: Boolean, required: true },
    imgSrc: { type: String, required: true },
    fallbackImgSrc: { type: String },
    imgSrcAlt: { type: String, required: true },
    videoSrc: { type: String, required: true },
    fallbackVideoSrc: { type: String },
    videoPreview: { type: String, required: true },
}, {
    timestamps: true,
    collection: 'videos'
});

export const Video = mongoose.model('Video', videoSchema);