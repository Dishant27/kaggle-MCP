# Kaggle MCP Server

A Model Context Protocol (MCP) server for interacting with Kaggle competitions.

## Features

- List active Kaggle competitions
- Download competition files
- Submit predictions to competitions
- View submission history

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
      "args": ["/path/to/build/index.js"],
      "env": {
        "KAGGLE_USERNAME": "dishantsr",
        "KAGGLE_KEY": "7ad10662ff80cd405615799f8eb5c664"
      }
    }
  }
}
```

## Available Tools

- `list-competitions`: List active Kaggle competitions
- `download-competition`: Download competition files
- `submit-to-competition`: Submit predictions to a competition
- `list-submissions`: View submission history

## Requirements

- You must have the Kaggle CLI installed and authenticated
- For competitions, you must have already accepted the competition rules on the Kaggle website

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

## License

MIT
