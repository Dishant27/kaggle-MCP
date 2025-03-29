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
      "args": ["/path/to/build/index.js"]
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

## License

MIT
