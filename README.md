# Kaggle MCP Server

A Model Context Protocol (MCP) server for interacting with Kaggle competitions and resources through Claude or other compatible AI assistants.

## Prerequisites

- Node.js 16 or higher
- TypeScript
- Kaggle CLI installed (`pip install kaggle`)
- Kaggle API credentials configured

## Authentication Setup

There are two ways to authenticate with the Kaggle API:

### Option 1: Using a kaggle.json file (Standard approach)

1. Install the Kaggle CLI:
```bash
pip install kaggle
```

2. Go to https://www.kaggle.com/account and click "Create New API Token"
3. This will download a `kaggle.json` file with your credentials
4. Create a `.kaggle` directory in your home folder (if it doesn't exist)
```bash
# On Linux/Mac
mkdir -p ~/.kaggle

# On Windows (PowerShell)
New-Item -ItemType Directory -Force -Path "$HOME\.kaggle"
```

5. Move the downloaded `kaggle.json` file to the `.kaggle` directory:
```bash
# On Linux/Mac
mv ~/Downloads/kaggle.json ~/.kaggle/
chmod 600 ~/.kaggle/kaggle.json  # Set permissions

# On Windows (PowerShell)
Move-Item -Path "$HOME\Downloads\kaggle.json" -Destination "$HOME\.kaggle\kaggle.json"
```

### Option 2: Using Claude for Desktop Configuration (Simpler)

You can directly add your Kaggle credentials to your `claude_desktop_config.json` file:

```json
{
  "mcpServers": {
    "kaggle": {
      "command": "node",
      "args": ["/path/to/build/index.js"],
      "env": {
        "KAGGLE_USERNAME": "your-kaggle-username",
        "KAGGLE_KEY": "your-kaggle-api-key"
      }
    }
  }
}
```

Replace `your-kaggle-username` and `your-kaggle-api-key` with your actual Kaggle credentials.

## Installation

1. Clone this repository
2. Install dependencies:

```bash
npm install
```

3. Build the project:

```bash
npm run build
```

## Usage

### Running the server

```bash
npm start
```

Or directly:

```bash
node build/index.js
```

### Connecting with Claude for Desktop

Add the following configuration to your `claude_desktop_config.json` file:

```json
{
  "mcpServers": {
    "kaggle": {
      "command": "node",
      "args": ["/absolute/path/to/build/index.js"],
      "env": {
        "KAGGLE_USERNAME": "your-username",
        "KAGGLE_KEY": "your-api-key"
      }
    }
  }
}
```

## Example Queries

Once connected to Claude, you can ask questions like:

### Competitions
- "Show me the active Kaggle competitions"
- "Search for image classification competitions"
- "Download the files for the Titanic competition"
- "Submit my predictions.csv file to the housing-prices competition with the message 'Random forest model'"
- "Show me my submissions for the digit-recognizer competition"

### Datasets
- "List datasets related to healthcare"
- "Download the COVID-19 dataset from user 'johnsmith'"
- "Create a new dataset from the files in /path/to/my/data"
- "Get metadata for the 'username/dataset-name' dataset"

### Notebooks
- "List my Kaggle notebooks"
- "Pull the 'data-exploration' notebook from user 'kaggler123'"
- "Push my updated notebook from /path/to/notebook"
- "Show me metadata for the 'username/notebook-name' notebook"

### Users
- "Show me my Kaggle profile information"
- "Get profile information for user 'grandmaster123'"

### Analysis
- "Show me the current leaderboard for the Titanic competition"
- "Get details about the House Prices competition"
- "Analyze the structure of my competition data in /path/to/competition"
- "Summarize the content of train.csv"

## Troubleshooting

### Authentication Issues

If you encounter authentication errors:

1. Verify your credentials are correctly set:
   - If using `kaggle.json`, check it's in the correct location:
     - Linux/Mac: `~/.kaggle/kaggle.json`
     - Windows: `C:\Users\<USERNAME>\.kaggle\kaggle.json`
   - If using environment variables, check the `env` section in your `claude_desktop_config.json`

2. For `kaggle.json`, check if the file has the correct permissions:
   - On Linux/Mac, run: `chmod 600 ~/.kaggle/kaggle.json`

3. Make sure your API token is still valid. If needed, generate a new one from your Kaggle account page.

### Installation Issues

If the Kaggle CLI is not found:

1. Make sure you have installed it with: `pip install kaggle`
2. Verify that the Kaggle command is in your PATH by running: `kaggle --version`

## Features

This server provides comprehensive access to Kaggle resources:

### 🏆 Competition Operations
- List and search for competitions
- Download competition files
- Submit to competitions
- View submission history

### 📊 Dataset Operations
- List and search for datasets
- Download dataset files
- Create new datasets
- Retrieve dataset metadata

### 📓 Notebook Integration
- List notebooks
- Pull notebooks for local use
- Push notebooks to Kaggle
- Get notebook metadata
- View notebook output

### 👤 User Management
- View current user information
- Get public profile information for other users

### 🔍 Competition Analysis
- View competition leaderboards
- Get detailed competition information
- Analyze competition data structure
- Summarize file contents

## License

MIT
