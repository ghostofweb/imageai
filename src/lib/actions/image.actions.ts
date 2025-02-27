'use server'

import { revalidatePath } from "next/cache";
import { connectDB } from "../database/connectDB";
import { handleError } from "../utils"
import UserModel from "@/models/User.model";
import ImageModel from "@/models/image.model";
import { redirect } from "next/navigation";
import {v2 as cloudinary} from 'cloudinary'
const populateUser = (query:any) => query.populate({
    path:"author",
    model:UserModel,
    select:'_id firstname lastname clerkId'
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
export async function getImageById(imageId: string) {
  try {
    await connectDB();
    const image = await populateUser(ImageModel.findById(imageId));
    if (!image) throw new Error("Image not found");
    console.log("Fetched image:", image); // Check this output
    return JSON.parse(JSON.stringify(image));
  } catch (error) {
    handleError(error);
  }
}


// Get all Images
export async function getAllImages({ limit = 9, page = 1, searchQuery = '' }: {
    limit?: number;
    page: number;
    searchQuery?: string;
  }) {
    try {
      await connectDB();
  
      cloudinary.config({
        cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true,
      })
  
      let expression = 'folder=imageai';
  
      if (searchQuery) {
        expression += ` AND ${searchQuery}`
      }
  
      const { resources } = await cloudinary.search
        .expression(expression)
        .execute();
  
      const resourceIds = resources.map((resource: any) => resource.public_id);
  
      let query = {};
  
      if(searchQuery) {
        query = {
          publicId: {
            $in: resourceIds
          }
        }
      }
  
      const skipAmount = (Number(page) -1) * limit;
  
      const images = await populateUser(ImageModel.find(query))
        .sort({ updatedAt: -1 })
        .skip(skipAmount)
        .limit(limit);
      
      const totalImages = await ImageModel.find(query).countDocuments();
      const savedImages = await ImageModel.find().countDocuments();
  
      return {
        data: JSON.parse(JSON.stringify(images)),
        totalPage: Math.ceil(totalImages / limit),
        savedImages,
      }
    } catch (error) {
      handleError(error)
    }
  }


  export async function getUserImages({
    limit = 9,
    page = 1,
    userId,
  }: {
    limit?: number;
    page: number;
    userId: string;
  }) {
    try {
      await connectDB();
  
      const skipAmount = (Number(page) - 1) * limit;
  
      const images = await populateUser(ImageModel.find({ author: userId }))
        .sort({ updatedAt: -1 })
        .skip(skipAmount)
        .limit(limit);
  
      const totalImages = await ImageModel.find({ author: userId }).countDocuments();
  
      return {
        data: JSON.parse(JSON.stringify(images)),
        totalPages: Math.ceil(totalImages / limit),
      };
    } catch (error) {
      handleError(error);
    }
  }