import { server } from "../core/server.js";
import { listDatasetsTool } from "./list-datasets.js";
import { downloadDatasetTool } from "./download-dataset.js";
import { createDatasetTool } from "./create-dataset.js";
import { getDatasetMetadataTool } from "./get-dataset-metadata.js";

/**
 * Register all dataset-related tools with the MCP server
 */
export function registerDatasetTools() {
  // Register dataset tools
  server.tool(
    "list-datasets",
    listDatasetsTool.parameters,
    (params) => listDatasetsTool.handler(params)
  );

  server.tool(
    "download-dataset",
    downloadDatasetTool.parameters,
    (params) => downloadDatasetTool.handler(params)
  );

  server.tool(
    "create-dataset",
    createDatasetTool.parameters,
    (params) => createDatasetTool.handler(params)
  );

  server.tool(
    "get-dataset-metadata",
    getDatasetMetadataTool.parameters,
    (params) => getDatasetMetadataTool.handler(params)
  );

  console.error("Registered dataset tools");
}