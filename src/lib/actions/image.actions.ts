'use server'

import { revalidatePath } from "next/cache";
import { connectDB } from "../database/connectDB";
import { handleError } from "../utils"
import UserModel from "@/models/User.model";
import ImageModel from "@/models/image.mode";
import { redirect } from "next/navigation";

const populateUser = (query:any) => query.populate({
    path:"author",
    model:UserModel,
    select:'_id firstname lastname'
})
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
        return JSON.parse(JSON.stringify(newImage));
    } catch (error) {
        handleError(error);
    }
}
//Update Image
export async function updateImage({image,userId,path}:UpdateImageParams) {
    try {
        await connectDB();
        const imageToUpdate = await ImageModel.findById(image._id);
        if (!imageToUpdate || imageToUpdate.author.toHexString() !== userId) throw new Error("Unauthorized or Image not found");
        const updatedImage = await ImageModel.findByIdAndUpdate(
            imageToUpdate._id,
            image,
            {new:true}
        )
        revalidatePath(path);
        return JSON.parse(JSON.stringify(updatedImage));
    } catch (error) {
        handleError(error);
    }
}

//Delete Image
export async function deleteImage(imageId:string) {
    try {
        await connectDB();
        await ImageModel.findByIdAndDelete(imageId)
    } catch (error) {
        handleError(error);
    }finally{
        redirect('/')
    }
}
//Get Image
export async function getImageById(imageId:string) {
    try {
        await connectDB();
        const image = await populateUser(ImageModel.findById(imageId));
        if (!image) throw new Error("Image not found");
        return JSON.parse(JSON.stringify(image));
    } catch (error) {
        handleError(error);
    }
}