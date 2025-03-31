import { execKaggleCommand } from "./kaggle-api.js";

/**
 * Lists Kaggle notebooks
 * 
 * @param options List notebooks options
 * @returns Promise with notebooks list
 */
export async function listNotebooks(
  options: { mine?: boolean, page?: number, pageSize?: number, search?: string, sortBy?: string } = {}
): Promise<string> {
  const args = ["kernels", "list", "--csv"];
  
  if (options.mine) {
    args.push("--mine");
  }
  
  if (options.page) {
    args.push("-p", options.page.toString());
  }
  
  if (options.pageSize) {
    args.push("-m", options.pageSize.toString());
  }

  if (options.search) {
    args.push("-s", options.search);
  }

  if (options.sortBy) {
    args.push("--sort-by", options.sortBy);
  }
  
  return execKaggleCommand(args);
}

/**
 * Pulls a notebook
 * 
 * @param notebook Notebook reference (user/notebook-name)
 * @param options Pull options
 * @returns Promise with pull result
 */
export async function pullNotebook(
  notebook: string,
  options: { path?: string, metadata?: boolean } = {}
): Promise<string> {
  const args = ["kernels", "pull", notebook];
  
  if (options.path) {
    args.push("-p", options.path);
  }
  
  if (options.metadata) {
    args.push("-m");
  }
  
  return execKaggleCommand(args);
}

/**
 * Pushes a notebook to Kaggle
 * 
 * @param folder Path to folder containing the notebook
 * @returns Promise with push result
 */
export async function pushNotebook(folder: string): Promise<string> {
  const args = ["kernels", "push", "-p", folder];
  return execKaggleCommand(args);
}

/**
 * Gets notebook metadata
 * 
 * @param notebook Notebook reference (user/notebook-name)
 * @returns Promise with metadata
 */
export async function getNotebookMetadata(notebook: string): Promise<string> {
  const args = ["kernels", "metadata", notebook];
  return execKaggleCommand(args);
}

/**
 * Outputs a notebook
 * 
 * @param notebook Notebook reference (user/notebook-name)
 * @returns Promise with output
 */
export async function outputNotebook(notebook: string): Promise<string> {
  const args = ["kernels", "output", notebook];
  return execKaggleCommand(args);
}