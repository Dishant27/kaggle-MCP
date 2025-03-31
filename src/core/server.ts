import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// Create MCP server instance that can be imported by other modules
export const server = new McpServer({
  name: "Kaggle API Integration",
  version: "2.0.0", // Updated version for extended functionality
  capabilities: {
    resources: {},
    tools: {}
  }
});

/**
 * Start the MCP server
 */
export async function startServer() {
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