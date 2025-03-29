#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// Import tools
import { listCompetitionsTool } from "./tools/list-competitions.js";
import { downloadCompetitionTool } from "./tools/download-competition.js";
import { submitToCompetitionTool } from "./tools/submit-to-competition.js";
import { listSubmissionsTool } from "./tools/list-submissions.js";

// Create MCP server
const server = new McpServer({
  name: "Kaggle Competitions",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {}
  }
});

// Register tools
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

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  console.error("Kaggle MCP Server starting...");
  
  try {
    await server.connect(transport);
    console.error("Kaggle MCP Server running");
  } catch (error) {
    console.error("Error starting Kaggle MCP Server:", error);
    process.exit(1);
  }
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});