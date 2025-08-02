# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Common Commands

### Development

- `deno task dev <slack-message-url>` - Run the CLI tool in development mode
  with a Slack message URL
- `deno task fmt` - Format all TypeScript/TSX files
- `deno task build` - Compile to a single Linux binary (for testing builds)
- `deno check main.ts` - Type check the entire project

### Testing & Quality Checks

- `deno test --allow-read --allow-env` - Run tests with necessary permissions
- `deno lint` - Lint TypeScript/TSX files using Deno's built-in linter
- `deno fmt --check` - Check if files are properly formatted (CI mode)

### Building for Release

- GitHub Actions handles cross-platform builds automatically on tag push
- Manual builds: Use `deno compile` with appropriate `--target` flags for
  different platforms
- Requires permissions: `--allow-net=slack.com --allow-env --allow-read=$HOME/.netrc`

## Architecture Overview

### Core Flow

1. **CLI Entry** (`main.ts` → `src/main.ts`): Parses command line args,
   authenticates, fetches message data
2. **Authentication** (`src/lib/auth.ts`): Handles both environment variables
   and .netrc file parsing
3. **URL Parsing** (`src/lib/slack-url.ts`): Extracts channel ID and message
   timestamp from Slack URLs
4. **API Layer** (`src/lib/slack-api.ts`): Manages all Slack Web API
   interactions
5. **Interactive UI** (`src/ui/app.tsx`): React/Ink-based terminal interface
   with keyboard input handling

### Key Components

**SlackApiClient** (`src/lib/slack-api.ts`):

- Centralized API client with typed responses
- Handles message fetching, user lookup, and reaction management
- Includes comprehensive error handling for Slack API responses

**React UI Components** (`src/ui/`):

- **App** (`app.tsx`): Main orchestrator component using custom hooks
- **Components** (`components/`): Focused, reusable UI components
  - `MessageDisplay`: Shows Slack message with author styling
  - `StatusBar`: Displays current mode and typed letters with colors
  - `StatusMessage`: Shows status updates and error messages
  - `HelpText`: Static command help text
- **Hooks** (`hooks/`): Custom React hooks for state and behavior
  - `useReactionManager`: Manages emoji reactions, color modes, and API calls
  - `useKeyboardHandler`: Handles all keyboard input events

**Type Definitions** (`src/types/`):

- `slack.ts`: Slack API response types and interfaces
- `ui.ts`: UI component types (ColorMode, TypedLetter)
- `index.ts`: Barrel exports for all types

**Authentication Strategy**:

- Priority: Environment variable (`SLACK_TOKEN`) → .netrc file → error
- .netrc parsing expects format: `machine slack.com login <token>`
- Uses Slack user tokens (xoxc-*) rather than bot tokens

### URL Format Support

- **Archives**: `https://workspace.slack.com/archives/CHANNEL/pTIMESTAMP`
- **Client**: `https://app.slack.com/client/TEAM/CHANNEL/MESSAGE`
- Timestamp conversion: `p1672534987000200` → `1672534987.000200`

### Emoji Naming Convention

- White letters: `:alphabet-white-a:` through `:alphabet-white-z:`
- Orange letters: `:alphabet-yellow-a:` through `:alphabet-yellow-z:`
- Alternating mode cycles between white/orange for each letter

### Project Structure

```
├── main.ts              # Root entry point (re-exports from src/)
├── src/
│   ├── main.ts          # Main application logic
│   ├── lib/             # Core business logic
│   │   ├── index.ts     # Barrel exports
│   │   ├── auth.ts      # Authentication utilities
│   │   ├── slack-api.ts # Slack API client
│   │   └── slack-url.ts # URL parsing utilities
│   ├── ui/              # User interface components
│   │   ├── app.tsx      # Main UI orchestrator component
│   │   ├── components/  # Reusable UI components
│   │   │   ├── index.ts # Component barrel exports
│   │   │   ├── MessageDisplay.tsx # Slack message display
│   │   │   ├── StatusBar.tsx      # Mode and typed letters display
│   │   │   ├── StatusMessage.tsx  # Status/error messages
│   │   │   └── HelpText.tsx       # Command help text
│   │   └── hooks/       # Custom React hooks
│   │       ├── index.ts           # Hook barrel exports
│   │       ├── useReactionManager.ts # Reaction state management
│   │       └── useKeyboardHandler.ts # Keyboard input handling
│   └── types/           # TypeScript type definitions
│       ├── index.ts     # Barrel exports
│       ├── slack.ts     # Slack API types
│       └── ui.ts        # UI component types
├── deno.json            # Deno configuration
└── package.json         # Package metadata
```

### Build & Release

- **CI/CD**: All PRs run format checks, linting, type checking, tests, and build
  verification
- **Release**: Uses release-please for automated versioning based on
  conventional commits
- **Binaries**: Cross-platform compilation via GitHub Actions (Linux, macOS
  Intel/ARM, Windows)
- **Output**: Single binary with embedded dependencies (~22MB with React/Ink)
