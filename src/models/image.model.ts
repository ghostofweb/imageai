import { Schema, Document, model, models } from "mongoose";

export interface IImage extends Document {
    title: string;
    transformationType: string;
    publicId: string;
    secureURL: string;
    width?: number;
    height?: number;
    config?: object;
    transformationUrl?: string;
    aspectRatio?: string;
    color?: string;
    prompt?: string;
    author?: {
        _id:string;
        firstName:string;
        lastname:string;
    }
    createdAt: Date;
    updatedAt: Date;
}

const ImageSchema = new Schema<IImage>(
    {
        title: { type: String, required: true },
        transformationType: { type: String, required: true },
        publicId: { type: String, required: true },
        secureURL: { type: String, required: true }, 
        width: { type: Number },
        height: { type: Number },
        config: { type: Object, default: {} },
        transformationUrl: { type: String }, 
        aspectRatio: { type: String },
        color: { type: String },
        prompt: { type: String },
        author: { type: Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true } 
);
const ImageModel = models?.Image || model<IImage>("Image",ImageSchema)

export default ImageModel;
