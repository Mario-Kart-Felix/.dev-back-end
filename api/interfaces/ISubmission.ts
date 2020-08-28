import { Document } from "mongoose";

export interface ISubmission extends Document {
  email: string;
  message: string;
}
