import { server } from "../core/server.js";
import { listNotebooksTool } from "./list-notebooks.js";
import { pullNotebookTool } from "./pull-notebook.js";
import { pushNotebookTool } from "./push-notebook.js";
import { getNotebookMetadataTool } from "./get-notebook-metadata.js";
import { outputNotebookTool } from "./output-notebook.js";

/**
 * Register all notebook-related tools with the MCP server
 */
export function registerNotebookTools() {
  // Register notebook tools
  server.tool(
    "list-notebooks",
    listNotebooksTool.parameters,
    (params) => listNotebooksTool.handler(params)
  );

  server.tool(
    "pull-notebook",
    pullNotebookTool.parameters,
    (params) => pullNotebookTool.handler(params)
  );

  server.tool(
    "push-notebook",
    pushNotebookTool.parameters,
    (params) => pushNotebookTool.handler(params)
  );

  server.tool(
    "get-notebook-metadata",
    getNotebookMetadataTool.parameters,
    (params) => getNotebookMetadataTool.handler(params)
  );

  server.tool(
    "output-notebook",
    outputNotebookTool.parameters,
    (params) => outputNotebookTool.handler(params)
  );

  console.error("Registered notebook tools");
}