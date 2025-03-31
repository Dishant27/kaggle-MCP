import { z } from "zod";
import { listNotebooks } from "../core/utils/kaggle-api-notebooks.js";

type ListNotebooksParams = {
  mine?: boolean;
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
};

export const listNotebooksTool = {
  parameters: {
    mine: z.boolean().optional().describe("List only your notebooks"),
    page: z.number().optional().describe("Page number"),
    pageSize: z.number().optional().describe("Number of notebooks per page"),
    search: z.string().optional().describe("Search term"),
    sortBy: z.string().optional().describe("Sort by field (hotness, commentCount, dateCreated, etc.)")
  },
  
  handler: async (params: ListNotebooksParams) => {
    try {
      const { mine, page, pageSize, search, sortBy } = params;
      const result = await listNotebooks({ mine, page, pageSize, search, sortBy });
      
      // Parse CSV into more readable format
      const lines = result.trim().split("\n");
      const headers = lines[0].split(",");
      
      const notebooks = lines.slice(1).map(line => {
        const values = line.split(",");
        const notebook: Record<string, string> = {};
        
        headers.forEach((header, index) => {
          notebook[header] = values[index] || "";
        });
        
        return notebook;
      });
      
      const formattedResult = notebooks.map(nb => 
        `Title: ${nb.title || "Unknown"}\n` +
        `ID: ${nb.ref || "Unknown"}\n` +
        `Author: ${nb.author || "Unknown"}\n` +
        `Language: ${nb.language || "Unknown"}\n` +
        `Last Updated: ${nb.lastRunTime || "Unknown"}\n` +
        `-------------------`
      ).join("\n\n");
      
      return {
        content: [{
          type: "text" as const,
          text: notebooks.length > 0 
            ? formattedResult 
            : "No notebooks found."
        }]
      };
      
    } catch (error) {
      console.error("Error listing notebooks:", error);
      return {
        content: [{
          type: "text" as const,
          text: `Error listing notebooks: ${(error as Error).message}`
        }],
        isError: true
      };
    }
  }
};