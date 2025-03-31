#!/usr/bin/env node
import { startServer } from "./core/server.js";

// Import tool registration functions
import { registerCompetitionTools } from "./competitions/index.js";
import { registerDatasetTools } from "./datasets/index.js";
import { registerNotebookTools } from "./notebooks/index.js";
import { registerUserTools } from "./users/index.js";
import { registerAnalysisTools } from "./analysis/index.js";

// Register all tools
registerCompetitionTools();
registerDatasetTools();
registerNotebookTools();
registerUserTools();
registerAnalysisTools();

// Start the server
startServer().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});