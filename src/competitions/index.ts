import { server } from "../core/server.js";
import { listCompetitionsTool } from "./list-competitions.js";
import { downloadCompetitionTool } from "./download-competition.js";
import { submitToCompetitionTool } from "./submit-to-competition.js";
import { listSubmissionsTool } from "./list-submissions.js";

/**
 * Register all competition-related tools with the MCP server
 */
export function registerCompetitionTools() {
  // Register competition tools
  server.tool(
    "list-competitions",
    listCompetitionsTool.parameters,
    (params) => listCompetitionsTool.handler(params)
  );

  server.tool(
    "download-competition",
    downloadCompetitionTool.parameters,
    (params) => downloadCompetitionTool.handler(params)
  );

  server.tool(
    "submit-to-competition",
    submitToCompetitionTool.parameters,
    (params) => submitToCompetitionTool.handler(params)
  );

  server.tool(
    "list-submissions",
    listSubmissionsTool.parameters,
    (params) => listSubmissionsTool.handler(params)
  );

  console.error("Registered competition tools");
}