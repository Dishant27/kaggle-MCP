import { z } from "zod";
import { getCurrentUser } from "../core/utils/kaggle-api-users.js";

type GetCurrentUserParams = {
  // No parameters needed
};

export const getCurrentUserTool = {
  parameters: {
    // No parameters needed
  },
  
  handler: async (_params: GetCurrentUserParams) => {
    try {
      const result = await getCurrentUser();
      
      return {
        content: [{
          type: "text" as const,
          text: `Current user information:\n\n${result}`
        }]
      };
      
    } catch (error) {
      console.error("Error retrieving current user:", error);
      return {
        content: [{
          type: "text" as const,
          text: `Error retrieving current user: ${(error as Error).message}`
        }],
        isError: true
      };
    }
  }
};