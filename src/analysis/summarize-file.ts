import { z } from "zod";
import { summarizeFile } from "../core/utils/kaggle-api-analysis.js";

type SummarizeFileParams = {
  path: string;
};

export const summarizeFileTool = {
  parameters: {
    path: z.string().describe("Path to file")
  },
  
  handler: async (params: SummarizeFileParams) => {
    try {
      const { path } = params;
      const result = await summarizeFile(path);
      
      return {
        content: [{
          type: "text" as const,
          text: result
        }]
      };
      
    } catch (error) {
      console.error("Error summarizing file:", error);
      return {
        content: [{
          type: "text" as const,
          text: `Error summarizing file: ${(error as Error).message}`
        }],
        isError: true
      };
    }
  }
};