import { z } from "zod";
import { listCompetitions } from "../utils/kaggle-api.js";

export const listCompetitionsTool = {
  parameters: {
    search: z.string().optional().describe("Search term to filter competitions"),
    page: z.number().optional().describe("Page number"),
    pageSize: z.number().optional().describe("Number of competitions per page")
  },
  
  handler: async ({ search, page, pageSize }) => {
    try {
      const result = await listCompetitions({ search, page, pageSize });
      
      // Parse CSV into more readable format
      const lines = result.trim().split("\n");
      const headers = lines[0].split(",");
      
      const competitions = lines.slice(1).map(line => {
        const values = line.split(",");
        const competition: Record<string, string> = {};
        
        headers.forEach((header, index) => {
          competition[header] = values[index] || "";
        });
        
        return competition;
      });
      
      const formattedResult = competitions.map(comp => 
        `Name: ${comp.title || comp.name || "Unknown"}\n` +
        `ID: ${comp.id || comp.ref || "Unknown"}\n` +
        `Category: ${comp.category || "Unknown"}\n` +
        `Deadline: ${comp.deadline || "Unknown"}\n` +
        `Prize: ${comp.prize || "Unknown"}USD\n` +
        `-------------------`
      ).join("\n\n");
      
      return {
        content: [{
          type: "text",
          text: competitions.length > 0 
            ? formattedResult 
            : "No competitions found."
        }]
      };
      
    } catch (error) {
      console.error("Error listing competitions:", error);
      return {
        content: [{
          type: "text",
          text: `Error listing competitions: ${(error as Error).message}`
        }],
        isError: true
      };
    }
  }
};