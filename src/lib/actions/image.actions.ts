'use server'

import { revalidatePath } from "next/cache";
import { connectDB } from "../database/connectDB";
import { handleError } from "../utils"
import UserModel from "@/models/User.model";
import ImageModel from "@/models/image.mode";

//ADD Image
export async function addImage({image,userId,path}:AddImageParams) {
    try {
        await connectDB();
        const author = await UserModel.findById(userId);
        if (!author) throw new Error("User not found");
        const newImage = await ImageModel.create({
            ...image,
            author:author._id
        })
        revalidatePath(path);
        return JSON.parse(JSON.stringify(image));
    } catch (error) {
        handleError(error);
    }
}
//Update Image
export async function updateImage({image,userId,path}:UpdateImageParams) {
    try {
        await connectDB();
        
        revalidatePath(path);
        return JSON.parse(JSON.stringify(image));
    } catch (error) {
        handleError(error);
    }
}

//Delete Image
export async function deleteImage(imageId:string) {
    try {
        await connectDB();

        revalidatePath(path);
        return JSON.parse(JSON.stringify(image));
    } catch (error) {
        handleError(error);
    }
}
//Get Image
export async function getImageById(imageId:string) {
    try {
        await connectDB();
        
        revalidatePath(path);
        return JSON.parse(JSON.stringify(image));
    } catch (error) {
        handleError(error);
    }
}