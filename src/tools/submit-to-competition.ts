import { z } from "zod";
import { submitToCompetition } from "../utils/kaggle-api.js";

type SubmitToCompetitionParams = {
  competition: string;
  file: string;
  message: string;
};

export const submitToCompetitionTool = {
  parameters: {
    competition: z.string().describe("Competition ID to submit to"),
    file: z.string().describe("Path to the submission file"),
    message: z.string().describe("Submission description message")
  },
  
  handler: async (params: SubmitToCompetitionParams) => {
    try {
      const { competition, file, message } = params;
      const result = await submitToCompetition(competition, file, message);
      
      return {
        content: [{
          type: "text" as const,
          text: `Successfully submitted to competition "${competition}".\n\n${result}`
        }]
      };
      
    } catch (error) {
      console.error("Error submitting to competition:", error);
      return {
        content: [{
          type: "text" as const,
          text: `Error submitting to competition: ${(error as Error).message}\n\nNote: You must accept the competition rules on the Kaggle website before submitting.`
        }],
        isError: true
      };
    }
  }
};