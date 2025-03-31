import { z } from "zod";
import { pushNotebook } from "../core/utils/kaggle-api-notebooks.js";
import fs from "fs";

type PushNotebookParams = {
  folder: string;
};

export const pushNotebookTool = {
  parameters: {
    folder: z.string().describe("Path to folder containing the notebook")
  },
  
  handler: async (params: PushNotebookParams) => {
    try {
      // Verify folder exists
      await fs.promises.access(params.folder, fs.constants.R_OK);
      
      const { folder } = params;
      const result = await pushNotebook(folder);
      
      return {
        content: [{
          type: "text" as const,
          text: `Successfully pushed notebook from: ${folder}\n\n${result}`
        }]
      };
      
    } catch (error) {
      console.error("Error pushing notebook:", error);
      
      let errorMessage = (error as Error).message;
      if (errorMessage.includes("ENOENT")) {
        errorMessage = `Folder not found: ${params.folder}. Please provide a valid folder path.`;
      }
      
      return {
        content: [{
          type: "text" as const,
          text: `Error pushing notebook: ${errorMessage}`
        }],
        isError: true
      };
    }
  }
};