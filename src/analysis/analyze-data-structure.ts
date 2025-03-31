import { z } from "zod";
import { analyzeCompetitionDataStructure } from "../core/utils/kaggle-api-analysis.js";

type AnalyzeDataStructureParams = {
  path: string;
};

export const analyzeDataStructureTool = {
  parameters: {
    path: z.string().describe("Path to competition data directory")
  },
  
  handler: async (params: AnalyzeDataStructureParams) => {
    try {
      const { path } = params;
      const result = await analyzeCompetitionDataStructure(path);
      
      return {
        content: [{
          type: "text" as const,
          text: result
        }]
      };
      
    } catch (error) {
      console.error("Error analyzing data structure:", error);
      return {
        content: [{
          type: "text" as const,
          text: `Error analyzing data structure: ${(error as Error).message}`
        }],
        isError: true
      };
    }
  }
};