import { z } from "zod";
import { getCompetitionDetails } from "../core/utils/kaggle-api-analysis.js";

type GetCompetitionDetailsParams = {
  competition: string;
};

export const getCompetitionDetailsTool = {
  parameters: {
    competition: z.string().describe("Competition ID")
  },
  
  handler: async (params: GetCompetitionDetailsParams) => {
    try {
      const { competition } = params;
      const result = await getCompetitionDetails(competition);
      
      return {
        content: [{
          type: "text" as const,
          text: `Details for competition ${competition}:\n\n${result}`
        }]
      };
      
    } catch (error) {
      console.error("Error retrieving competition details:", error);
      return {
        content: [{
          type: "text" as const,
          text: `Error retrieving competition details: ${(error as Error).message}`
        }],
        isError: true
      };
    }
  }
};