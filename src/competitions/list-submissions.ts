import { z } from "zod";
import { listSubmissions } from "../core/utils/kaggle-api.js";

type ListSubmissionsParams = {
  competition: string;
};

export const listSubmissionsTool = {
  parameters: {
    competition: z.string().describe("Competition ID to list submissions for")
  },
  
  handler: async (params: ListSubmissionsParams) => {
    try {
      const { competition } = params;
      const result = await listSubmissions(competition);
      
      // Parse CSV into more readable format
      const lines = result.trim().split("\n");
      
      if (lines.length <= 1) {
        return {
          content: [{
            type: "text" as const,
            text: `No submissions found for competition: ${competition}`
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
        `Date: ${sub.date || sub.submittedOn || "Unknown"}\n` +
        `Description: ${sub.description || sub.message || "No description"}\n` +
        `Status: ${sub.status || "Unknown"}\n` +
        `Score: ${sub.score || "Not scored"}\n` +
        `-------------------`
      ).join("\n\n");
      
      return {
        content: [{
          type: "text" as const,
          text: `Submissions for competition ${competition}:\n\n${formattedResult}`
        }]
      };
      
    } catch (error) {
      console.error("Error listing submissions:", error);
      return {
        content: [{
          type: "text" as const,
          text: `Error listing submissions: ${(error as Error).message}`
        }],
        isError: true
      };
    }
  }
};