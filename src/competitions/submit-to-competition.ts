import { z } from "zod";
import { submitToCompetition } from "../core/utils/kaggle-api.js";
import fs from "fs";

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
      // Verify file exists before submission
      await fs.promises.access(params.file, fs.constants.R_OK);
      
      const { competition, file, message } = params;
      const result = await submitToCompetition(competition, file, message);
      
      return {
        content: [{
          type: "text" as const,
          text: `Successfully submitted to ${competition} competition.\n\n${result}`
        }]
      };
      
    } catch (error) {
      console.error("Error submitting to competition:", error);
      
      let errorMessage = (error as Error).message;
      if (errorMessage.includes("ENOENT")) {
        errorMessage = `File not found: ${params.file}. Please provide a valid file path.`;
      }
      
      return {
        content: [{
          type: "text" as const,
          text: `Error submitting to competition: ${errorMessage}`
        }],
        isError: true
      };
    }
  }
};