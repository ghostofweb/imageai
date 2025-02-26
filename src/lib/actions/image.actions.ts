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

// Get all Images
export async function getAllImages({
    limit = 9,
    page = 1,
    searchQuery,
  }: {
    limit?: number;
    page?: number;
    searchQuery?: string;
  }) {
    try {
      // Connect to MongoDB
      await connectDB();
  
      // Configure Cloudinary (should ideally be in a separate config file)
      cloudinary.config({
        cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true,
      });
  
      // Define search expression for Cloudinary
      let expression = "folder=imageai"; // Fetch images from the 'imageai' folder
      if (searchQuery) {
        expression += ` AND ${searchQuery}`; // Add search query if provided
      }
  
      // Fetch matching images from Cloudinary
      const { resources } = await cloudinary.search.expression(expression).execute();
  
      // Extract public IDs from Cloudinary search results
      const resourceIds = resources.map((resource: any) => resource.public_id);
  
      // Build MongoDB query based on search results
      const query = searchQuery ? { publicId: { $in: resourceIds } } : {};
  
      // Calculate the number of documents to skip for pagination
      const skipAmount = (page - 1) * limit;
  
      // Fetch images from MongoDB based on query
      const images = await ImageModel.find(query)
        .sort({ createdAt: -1 }) // Sort images by newest first
        .skip(skipAmount)
        .limit(limit)
        .populate("author", "firstName lastName"); // Populate author details (if applicable)
  
      // Count total images that match the query
      const totalImages = await ImageModel.countDocuments(query);
  
      // Return the results with pagination details
      return {
        data: images, // The images to display
        totalPages: Math.ceil(totalImages / limit), // Calculate total pages
      };
    } catch (error) {
      // Handle errors gracefully
      console.error("Error fetching images:", error);
      throw new Error("Failed to fetch images");
    }
  }