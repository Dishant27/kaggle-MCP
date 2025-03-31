import { z } from "zod";
import { getNotebookMetadata } from "../core/utils/kaggle-api-notebooks.js";

type GetNotebookMetadataParams = {
  notebook: string;
};

export const getNotebookMetadataTool = {
  parameters: {
    notebook: z.string().describe("Notebook reference (user/notebook-name)")
  },
  
  handler: async (params: GetNotebookMetadataParams) => {
    try {
      const { notebook } = params;
      const result = await getNotebookMetadata(notebook);
      
      return {
        content: [{
          type: "text" as const,
          text: `Metadata for notebook ${notebook}:\n\n${result}`
        }]
      };
      
    } catch (error) {
      console.error("Error getting notebook metadata:", error);
      return {
        content: [{
          type: "text" as const,
          text: `Error getting notebook metadata: ${(error as Error).message}`
        }],
        isError: true
      };
    }
  }
};