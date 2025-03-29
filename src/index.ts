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
  listCompetitionsTool.handler
);

server.tool(
  "download-competition",
  downloadCompetitionTool.parameters,
  downloadCompetitionTool.handler
);

server.tool(
  "submit-to-competition",
  submitToCompetitionTool.parameters,
  submitToCompetitionTool.handler
);

server.tool(
  "list-submissions",
  listSubmissionsTool.parameters,
  listSubmissionsTool.handler
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