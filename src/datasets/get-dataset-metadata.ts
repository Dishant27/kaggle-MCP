import { z } from "zod";
import { getDatasetMetadata } from "../core/utils/kaggle-api-datasets.js";

type GetDatasetMetadataParams = {
  dataset: string;
};

export const getDatasetMetadataTool = {
  parameters: {
    dataset: z.string().describe("Dataset ID (format: username/dataset-name)")
  },
  
  handler: async (params: GetDatasetMetadataParams) => {
    try {
      const { dataset } = params;
      const result = await getDatasetMetadata(dataset);
      
      return {
        content: [{
          type: "text" as const,
          text: `Metadata for dataset ${dataset}:\n\n${result}`
        }]
      };
      
    } catch (error) {
      console.error("Error getting dataset metadata:", error);
      return {
        content: [{
          type: "text" as const,
          text: `Error getting dataset metadata: ${(error as Error).message}`
        }],
        isError: true
      };
    }
  }
};