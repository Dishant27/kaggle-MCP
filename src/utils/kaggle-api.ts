import { spawn } from "child_process";

/**
 * Executes a Kaggle CLI command and returns the output
 * 
 * @param args Kaggle CLI command arguments
 * @returns Promise with command output
 */
export async function execKaggleCommand(args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const process = spawn("kaggle", args, { stdio: ['ignore', 'pipe', 'pipe'] });
    
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
        reject(new Error(`Kaggle command failed with code ${code}: ${stderr}`));
      }
    });
    
    process.on("error", (err) => {
      reject(new Error(`Failed to execute Kaggle command: ${err.message}`));
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