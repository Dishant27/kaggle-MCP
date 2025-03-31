import { z } from "zod";
import { outputNotebook } from "../core/utils/kaggle-api-notebooks.js";

type OutputNotebookParams = {
  notebook: string;
};

export const outputNotebookTool = {
  parameters: {
    notebook: z.string().describe("Notebook reference (user/notebook-name)")
  },
  
  handler: async (params: OutputNotebookParams) => {
    try {
      const { notebook } = params;
      const result = await outputNotebook(notebook);
      
      return {
        content: [{
          type: "text" as const,
          text: `Output for notebook ${notebook}:\n\n${result}`
        }]
      };
      
    } catch (error) {
      console.error("Error getting notebook output:", error);
      return {
        content: [{
          type: "text" as const,
          text: `Error getting notebook output: ${(error as Error).message}`
        }],
        isError: true
      };
    }
  }
};