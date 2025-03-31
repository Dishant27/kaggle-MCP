import { z } from "zod";
import { pullNotebook } from "../core/utils/kaggle-api-notebooks.js";
import fs from "fs";
import path from "path";

type PullNotebookParams = {
  notebook: string;
  path?: string;
  metadata?: boolean;
};

export const pullNotebookTool = {
  parameters: {
    notebook: z.string().describe("Notebook reference (user/notebook-name)"),
    path: z.string().optional().describe("Path where to pull the notebook"),
    metadata: z.boolean().optional().describe("Pull metadata only")
  },
  
  handler: async (params: PullNotebookParams) => {
    try {
      const { notebook, path: outputPath, metadata } = params;
      
      // Create the directory if it doesn't exist
      if (outputPath) {
        await fs.promises.mkdir(outputPath, { recursive: true });
      }
      
      const result = await pullNotebook(notebook, { path: outputPath, metadata });
      
      return {
        content: [{
          type: "text" as const,
          text: `Successfully pulled notebook: ${notebook}\n\n${result}`
        }]
      };
      
    } catch (error) {
      console.error("Error pulling notebook:", error);
      return {
        content: [{
          type: "text" as const,
          text: `Error pulling notebook: ${(error as Error).message}`
        }],
        isError: true
      };
    }
  }
};