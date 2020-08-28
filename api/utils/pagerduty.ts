import { ISubmission } from "../interfaces/ISubmission";
import axios from "axios";

export const newSubmission = async (submission: ISubmission) => {
  const { email, message } = submission;
  const body = {
    payload: {
      summary: `New Submission! ${email || "no email address provided..."}: ${
        message?.slice(0, 150) || "no message"
      }...`,
      severity: "info",
      source: "sjoseph7.dev-email-submission"
    },
    event_action: "trigger",
    routing_key: process.env.PAGER_DUTY_ROUTING_KEY || ""
  };
  try {
    await axios.post("https://events.pagerduty.com/v2/enqueue", body);
    console.info(`[${Date.now()}] `, "NEW SUBMISSION: ", { email, message });
  } catch (err) {
    console.error(
      `Unable to page with PagerDuty; { email: ${email}, message: ${message}}`
    );
  }
};
