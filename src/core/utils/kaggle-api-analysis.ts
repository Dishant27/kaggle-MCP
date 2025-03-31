import { execKaggleCommand } from "./kaggle-api.js";
import fs from "fs";
import path from "path";

/**
 * Gets leaderboard for a competition
 * 
 * @param competition Competition ID
 * @param options Leaderboard options
 * @returns Promise with leaderboard data
 */
export async function getLeaderboard(
  competition: string,
  options: { page?: number, pageSize?: number } = {}
): Promise<string> {
  const args = ["competitions", "leaderboard", "-c", competition, "--csv"];
  
  if (options.page) {
    args.push("-p", options.page.toString());
  }
  
  if (options.pageSize) {
    args.push("-n", options.pageSize.toString());
  }
  
  return execKaggleCommand(args);
}

/**
 * Gets competition details
 * 
 * @param competition Competition ID
 * @returns Promise with competition details
 */
export async function getCompetitionDetails(competition: string): Promise<string> {
  const args = ["competitions", "metadata", "-c", competition];
  return execKaggleCommand(args);
}

/**
 * Analyzes the competition data files structure
 * 
 * @param competitionPath Path to competition files
 * @returns Analysis of data structure
 */
export async function analyzeCompetitionDataStructure(competitionPath: string): Promise<string> {
  try {
    // Check if the directory exists
    await fs.promises.access(competitionPath, fs.constants.R_OK);
    
    // Get files and directories in the competition path
    const entries = await fs.promises.readdir(competitionPath, { withFileTypes: true });
    
    // Analyze structure
    let analysis = `Data Structure Analysis for path ${competitionPath}:\n\n`;
    
    // Categorize files by type
    const fileTypes: Record<string, string[]> = {};
    
    for (const entry of entries) {
      const entryPath = path.join(competitionPath, entry.name);
      
      if (entry.isDirectory()) {
        analysis += `📁 Directory: ${entry.name}\n`;
        // Recursively list files in subdirectory
        const subEntries = await fs.promises.readdir(entryPath, { withFileTypes: true });
        for (const subEntry of subEntries) {
          analysis += `  - ${subEntry.isDirectory() ? '📁' : '📄'} ${subEntry.name}\n`;
        }
      } else {
        // Get file extension
        const ext = path.extname(entry.name).toLowerCase();
        if (!fileTypes[ext]) {
          fileTypes[ext] = [];
        }
        fileTypes[ext].push(entry.name);
      }
    }
    
    // Add file type summary
    analysis += "\nFile Types:\n";
    for (const [ext, files] of Object.entries(fileTypes)) {
      analysis += `${ext || 'No extension'}: ${files.length} file(s)\n`;
      // List first 5 files of each type
      files.slice(0, 5).forEach(file => {
        analysis += `  - ${file}\n`;
      });
      if (files.length > 5) {
        analysis += `  - ... and ${files.length - 5} more\n`;
      }
    }
    
    return analysis;
    
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new Error(`Directory not found: ${competitionPath}`);
    }
    throw error;
  }
}

/**
 * Summarizes file content based on file type
 * 
 * @param filePath Path to the file
 * @returns Promise with file summary
 */
export async function summarizeFile(filePath: string): Promise<string> {
  try {
    // Check if the file exists
    await fs.promises.access(filePath, fs.constants.R_OK);
    
    const ext = path.extname(filePath).toLowerCase();
    const fileName = path.basename(filePath);
    const fileStats = await fs.promises.stat(filePath);
    const fileSize = fileStats.size;
    
    // Basic file info
    let summary = `Summary for file ${fileName}:\n`;
    summary += `Type: ${ext}\n`;
    summary += `Size: ${(fileSize / 1024).toFixed(2)} KB\n`;
    
    // For small text files, provide more detailed analysis
    if (['.csv', '.txt', '.md', '.json'].includes(ext) && fileSize < 1024 * 1024) {
      const content = await fs.promises.readFile(filePath, 'utf8');
      const lines = content.split('\n');
      
      summary += `Line count: ${lines.length}\n\n`;
      
      if (ext === '.csv') {
        // CSV analysis
        if (lines.length > 0) {
          const headers = lines[0].split(',');
          summary += `CSV Headers (${headers.length}): ${headers.join(', ')}\n`;
          summary += `Sample rows: ${Math.min(5, lines.length - 1)}\n`;
          
          // Show a few sample rows
          for (let i = 1; i < Math.min(6, lines.length); i++) {
            summary += `Row ${i}: ${lines[i].substring(0, 100)}${lines[i].length > 100 ? '...' : ''}\n`;
          }
        }
      } else if (ext === '.json') {
        // JSON analysis - just check structure
        try {
          const jsonContent = JSON.parse(content);
          if (Array.isArray(jsonContent)) {
            summary += `JSON Array with ${jsonContent.length} items\n`;
            if (jsonContent.length > 0) {
              summary += `First item sample: ${JSON.stringify(jsonContent[0]).substring(0, 100)}...\n`;
            }
          } else {
            summary += `JSON Object with ${Object.keys(jsonContent).length} top-level keys\n`;
            summary += `Keys: ${Object.keys(jsonContent).join(', ')}\n`;
          }
        } catch (e) {
          summary += `Invalid JSON format\n`;
        }
      } else {
        // Simple text file, show beginning
        summary += `First 5 lines:\n`;
        for (let i = 0; i < Math.min(5, lines.length); i++) {
          summary += `${i + 1}: ${lines[i].substring(0, 100)}${lines[i].length > 100 ? '...' : ''}\n`;
        }
      }
    } else {
      summary += `File is too large or not a text format for detailed analysis\n`;
    }
    
    return summary;
    
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new Error(`File not found: ${filePath}`);
    }
    throw error;
  }
}