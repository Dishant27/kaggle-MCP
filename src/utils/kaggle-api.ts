import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";

// Environment variable names for credentials
const KAGGLE_USERNAME_ENV = "KAGGLE_USERNAME";
const KAGGLE_KEY_ENV = "KAGGLE_KEY";

/**
 * Verifies Kaggle API credentials are configured either via:
 * 1. kaggle.json file in the standard location
 * 2. Environment variables
 * 
 * @returns Promise resolving to true if credentials exist
 */
export async function verifyKaggleCredentials(): Promise<boolean> {
  // Check environment variables first
  const usernameEnv = process.env[KAGGLE_USERNAME_ENV];
  const keyEnv = process.env[KAGGLE_KEY_ENV];
  
  if (usernameEnv && keyEnv) {
    return true;
  }
  
  // Check for credential file
  const credentialsPath = path.join(os.homedir(), ".kaggle", "kaggle.json");
  
  try {
    await fs.promises.access(credentialsPath, fs.constants.R_OK);
    return true;
  } catch (error) {
    throw new Error(
      "Kaggle API credentials not found. You can set them up in one of two ways:\n" +
      "1. Create a kaggle.json file in ~/.kaggle/ with your credentials\n" +
      "2. Add KAGGLE_USERNAME and KAGGLE_KEY to the env section in claude_desktop_config.json\n\n" +
      "For more information, visit: https://github.com/Kaggle/kaggle-api"
    );
  }
}

/**
 * Executes a Kaggle CLI command and returns the output
 * 
 * @param args Kaggle CLI command arguments
 * @returns Promise with command output
 */
export async function execKaggleCommand(args: string[]): Promise<string> {
  // Verify credentials before executing command
  await verifyKaggleCredentials();
  
  return new Promise((resolve, reject) => {
    const process = spawn("kaggle", args, { 
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env } // Pass environment variables through
    });
    
    let stdout = "";
    let stderr = "";
    
    process.stdout.on("data", (data) => {
      stdout += data.toString();
    });
    
    process.stderr.on("data", (data) => {
      stderr += data.toString();
    });
    
    process.on("close", (code) => {
      if (code === 0) {
        resolve(stdout);
      } else {
        // Check for authentication errors
        if (stderr.includes("401") || stderr.includes("unauthorized") || stderr.includes("authentication")) {
          reject(new Error(`Kaggle authentication failed. Please check your API credentials. Error: ${stderr}`));
        } else {
          reject(new Error(`Kaggle command failed with code ${code}: ${stderr}`));
        }
      }
    });
    
    process.on("error", (err) => {
      if (err.message.includes("ENOENT")) {
        reject(new Error("Kaggle CLI not found. Please install it using 'pip install kaggle'."));
      } else {
        reject(new Error(`Failed to execute Kaggle command: ${err.message}`));
      }
    });
  });
}

/**
 * Lists Kaggle competitions
 * 
 * @param options List competitions options
 * @returns Promise with competitions list
 */
export async function listCompetitions(
  options: { search?: string, page?: number, pageSize?: number } = {}
): Promise<string> {
  const args = ["competitions", "list", "--csv"];
  
  if (options.search) {
    args.push("-s", options.search);
  }
  
  if (options.page) {
    args.push("-p", options.page.toString());
  }
  
  if (options.pageSize) {
    args.push("--size", options.pageSize.toString());
  }
  
  return execKaggleCommand(args);
}

/**
 * Downloads competition files
 * 
 * @param competition Competition ID
 * @param options Download options
 * @returns Promise with download result
 */
export async function downloadCompetition(
  competition: string,
  options: { path?: string, force?: boolean, quiet?: boolean } = {}
): Promise<string> {
  const args = ["competitions", "download", "-c", competition];
  
  if (options.path) {
    args.push("-p", options.path);
  }
  
  if (options.force) {
    args.push("-f");
  }
  
  if (options.quiet) {
    args.push("-q");
  }
  
  return execKaggleCommand(args);
}

/**
 * Submits to a competition
 * 
 * @param competition Competition ID
 * @param file Submission file path
 * @param message Submission message
 * @returns Promise with submission result
 */
export async function submitToCompetition(
  competition: string,
  file: string,
  message: string
): Promise<string> {
  const args = [
    "competitions", 
    "submit", 
    "-c", competition, 
    "-f", file, 
    "-m", message
  ];
  
  return execKaggleCommand(args);
}

/**
 * Lists submissions for a competition
 * 
 * @param competition Competition ID
 * @returns Promise with submissions list
 */
export async function listSubmissions(competition: string): Promise<string> {
  const args = ["competitions", "submissions", "-c", competition, "--csv"];
  
  return execKaggleCommand(args);
}