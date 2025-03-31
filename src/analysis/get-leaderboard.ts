import { z } from "zod";
import { getLeaderboard } from "../core/utils/kaggle-api-analysis.js";

type GetLeaderboardParams = {
  competition: string;
  page?: number;
  pageSize?: number;
};

export const getLeaderboardTool = {
  parameters: {
    competition: z.string().describe("Competition ID"),
    page: z.number().optional().describe("Page number"),
    pageSize: z.number().optional().describe("Number of entries per page")
  },
  
  handler: async (params: GetLeaderboardParams) => {
    try {
      const { competition, page, pageSize } = params;
      const result = await getLeaderboard(competition, { page, pageSize });
      
      // Parse CSV into more readable format
      const lines = result.trim().split("\n");
      const headers = lines[0].split(",");
      
      const entries = lines.slice(1).map(line => {
        const values = line.split(",");
        const entry: Record<string, string> = {};
        
        headers.forEach((header, index) => {
          entry[header] = values[index] || "";
        });
        
        return entry;
      });
      
      const formattedResult = entries.map((entry, index) => 
        `Rank ${index + 1}: ${entry.TeamName || "Unknown"}\n` +
        `Score: ${entry.Score || "Not scored"}\n` +
        `Entries: ${entry.SubmissionCount || "0"}\n` +
        `Last Submitted: ${entry.LastSubmission || "Unknown"}\n` +
        `-------------------`
      ).join("\n\n");
      
      return {
        content: [{
          type: "text" as const,
          text: entries.length > 0 
            ? `Leaderboard for competition ${competition}:\n\n${formattedResult}` 
            : `No leaderboard entries found for competition: ${competition}`
        }]
      };
      
    } catch (error) {
      console.error("Error retrieving leaderboard:", error);
      return {
        content: [{
          type: "text" as const,
          text: `Error retrieving leaderboard: ${(error as Error).message}`
        }],
        isError: true
      };
    }
  }
};