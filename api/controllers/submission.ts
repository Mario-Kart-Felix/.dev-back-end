import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/async";
import { Submission } from "../models/Submission";
import * as pagerDuty from "../utils/pagerduty";

// @desc    Create new submission
// @route   POST /api/v1/submission
// @access  Public
export const createSubmission = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, message } = req.body;
    try {
      let newSubmission = await Submission.create({ email, message });

      await pagerDuty.newSubmission(newSubmission).catch(err => {
        console.error(`PagerDuty error: ${err}`);
      });

      return res.status(201).json({ success: true, data: newSubmission });
    } catch (err) {
      throw err;
    }
  }
);
