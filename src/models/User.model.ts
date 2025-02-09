import { Schema, model, models, Document } from "mongoose";

export interface IUser extends Document {
  clerkId: string;
  email: string;
  username: string;
  photo: string;
  firstName?: string;
  lastName?: string;
  planId?: number;
  creditBalance: number;
  createdAt: Date;
  updatedAt: Date;
}

// Define Mongoose Schema
const UserSchema = new Schema<IUser>(
  {
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    photo: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    planId: { type: Number, default: 1 },
    creditBalance: { type: Number, default: 10 },
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt
);

// Use existing model if it exists, otherwise create a new one
const UserModel = models.User || model<IUser>("User", UserSchema);

export default UserModel;
