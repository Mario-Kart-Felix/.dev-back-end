/**
 * "Submission" route
 *
 * @desc These are the routes for submissions.
 */

import { Router, Request, Response } from "express";
import { createSubmission } from "../api/controllers/submission";

const router = Router();

router.get("/help", (req: Request, res: Response) => {
  const helpfulMessage = `Post a JSON body: { email: "...", message: "..." }; that's it! Good luck.`;
  return res.status(200).send(helpfulMessage);
});

router.route("/").post(createSubmission);

export default router;
