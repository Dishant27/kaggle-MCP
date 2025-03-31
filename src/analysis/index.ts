import { server } from "../core/server.js";
import { getLeaderboardTool } from "./get-leaderboard.js";
import { getCompetitionDetailsTool } from "./get-competition-details.js";
import { analyzeDataStructureTool } from "./analyze-data-structure.js";
import { summarizeFileTool } from "./summarize-file.js";

/**
 * Register all analysis-related tools with the MCP server
 */
export function registerAnalysisTools() {
  // Register analysis tools
  server.tool(
    "get-leaderboard",
    getLeaderboardTool.parameters,
    (params) => getLeaderboardTool.handler(params)
  );

  server.tool(
    "get-competition-details",
    getCompetitionDetailsTool.parameters,
    (params) => getCompetitionDetailsTool.handler(params)
  );

  server.tool(
    "analyze-data-structure",
    analyzeDataStructureTool.parameters,
    (params) => analyzeDataStructureTool.handler(params)
  );

  server.tool(
    "summarize-file",
    summarizeFileTool.parameters,
    (params) => summarizeFileTool.handler(params)
  );

  console.error("Registered analysis tools");
}