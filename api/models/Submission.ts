/**
 * Mongoose "Submission" Schema
 *
 * @desc This is the schema for a submission.
 */

import { Schema, model } from "mongoose";
import { ISubmission } from "../interfaces/ISubmission";

const SubmissionSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "no email address provided"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "provided email address is not valid"
      ]
    },
    message: {
      type: String,
      trim: true,
      required: [true, "no message provided"],
      maxlength: [5000, "message cannot be longer than 5000 characters"]
    }
  },
  {
    timestamps: true
  }
);

export let Submission = model<ISubmission>("Submission", SubmissionSchema);
