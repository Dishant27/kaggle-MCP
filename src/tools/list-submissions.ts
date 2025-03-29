import { z } from "zod";
import { listSubmissions } from "../utils/kaggle-api.js";

export const listSubmissionsTool = {
  parameters: {
    competition: z.string().describe("Competition ID to list submissions for")
  },
  
  handler: async ({ competition }) => {
    try {
      const result = await listSubmissions(competition);
      
      // Parse CSV into more readable format
      const lines = result.trim().split("\n");
      
      if (lines.length <= 1) {
        return {
          content: [{
            type: "text",
            text: `No submissions found for competition "${competition}".`
          }]
        };
      }
      
      const headers = lines[0].split(",");
      
      const submissions = lines.slice(1).map(line => {
        const values = line.split(",");
        const submission: Record<string, string> = {};
        
        headers.forEach((header, index) => {
          submission[header] = values[index] || "";
        });
        
        return submission;
      });
      
      const formattedResult = submissions.map(sub => 
        `ID: ${sub.id || "Unknown"}\n` +
        `Filename: ${sub.fileName || sub.filename || "Unknown"}\n` +
        `Date: ${sub.date || sub.submittedAt || "Unknown"}\n` +
        `Description: ${sub.description || "Unknown"}\n` +
        `Status: ${sub.status || "Unknown"}\n` +
        `Score: ${sub.publicScore || sub.score || "Unknown"}\n` +
        `-------------------`
      ).join("\n\n");
      
      return {
        content: [{
          type: "text",
          text: formattedResult
        }]
      };
      
    } catch (error) {
      console.error("Error listing submissions:", error);
      return {
        content: [{
          type: "text",
          text: `Error listing submissions: ${(error as Error).message}`
        }],
        isError: true
      };
    }
  }
};