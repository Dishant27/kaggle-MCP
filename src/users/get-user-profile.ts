import { z } from "zod";
import { getUserProfile } from "../core/utils/kaggle-api-users.js";

type GetUserProfileParams = {
  username: string;
};

export const getUserProfileTool = {
  parameters: {
    username: z.string().describe("Kaggle username to view profile information")
  },
  
  handler: async (params: GetUserProfileParams) => {
    try {
      const { username } = params;
      const result = await getUserProfile(username);
      
      return {
        content: [{
          type: "text" as const,
          text: `Profile information for ${username}:\n\n${result}`
        }]
      };
      
    } catch (error) {
      console.error("Error retrieving user profile:", error);
      return {
        content: [{
          type: "text" as const,
          text: `Error retrieving user profile: ${(error as Error).message}`
        }],
        isError: true
      };
    }
  }
};