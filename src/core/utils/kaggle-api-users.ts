import { execKaggleCommand } from "./kaggle-api.js";

/**
 * Gets the current user's profile information
 * 
 * @returns Promise with profile information
 */
export async function getCurrentUser(): Promise<string> {
  const args = ["config", "view", "-v"];
  return execKaggleCommand(args);
}

/**
 * Gets a user's public profile information
 * 
 * @param username The username to look up
 * @returns Promise with public profile information
 */
export async function getUserProfile(username: string): Promise<string> {
  // Note: Kaggle CLI doesn't have a direct command for this, so we're using a workaround
  // by listing datasets from that user and extracting profile info
  const args = ["datasets", "list", "-o", username, "--csv", "-m", "1"];
  return execKaggleCommand(args);
}