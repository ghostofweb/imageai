import { Schema ,Document} from "mongoose";

interface ImageSchema extends Document{
    title:string;
    transformationType:string;
}
const ImageSchema = new Schema<ImageSchema>({
    title:{type:String,required:true},
    transformationType:{type:String,required:true},

})