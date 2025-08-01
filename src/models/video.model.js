import mongoose, { Schema } from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

const videoSchema = new Schema({
    videoFile: {
        type: String, // cloudinary URL
        required: true,
    },
    thumbnail: {
        type: String, // cloudinary URL
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    duration:{
        type: Number, // duration in seconds
        required: true,
    },
    views: {
        type: Number, 
        default: 0,
    },
    isPublished: {
        type: Boolean,
        default: false,
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
    }
},{timestamps: true});

videoSchema.plugin(mongooseAggregatePaginate);
export const Video = mongoose.model('Video', VideoSchema);