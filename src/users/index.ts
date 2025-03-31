import { server } from "../core/server.js";
import { getCurrentUserTool } from "./get-current-user.js";
import { getUserProfileTool } from "./get-user-profile.js";

/**
 * Register all user-related tools with the MCP server
 */
export function registerUserTools() {
  // Register user tools
  server.tool(
    "get-current-user",
    getCurrentUserTool.parameters,
    (params) => getCurrentUserTool.handler(params)
  );

  server.tool(
    "get-user-profile",
    getUserProfileTool.parameters,
    (params) => getUserProfileTool.handler(params)
  );

  console.error("Registered user tools");
}