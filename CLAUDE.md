# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Common Commands

### Development

- `deno task dev <slack-message-url>` - Run the CLI tool in development mode
  with a Slack message URL
- `deno task fmt` - Format all TypeScript/TSX files
- `deno task build` - Compile to a single Linux binary (for testing builds)
- `deno check src/main.ts` - Type check the entire project

### Testing & Quality Checks

- `deno test --allow-read --allow-env` - Run tests with necessary permissions
- `deno lint` - Lint TypeScript/TSX files using Deno's built-in linter
- `deno fmt --check` - Check if files are properly formatted (CI mode)

### Building for Release

- GitHub Actions handles cross-platform builds automatically on tag push
- Manual builds: Use `deno compile` with appropriate `--target` flags for
  different platforms
- Requires permissions:
  `--allow-net=slack.com --allow-env=SLACK_TOKEN --allow-read=$HOME/.netrc`

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
  - `MessageDisplay`: Shows Slack message with author styling and timestamp
  - `InputBox`: Modern bordered input display with pending state visualization
  - `StatusMessage`: Shows status updates and error messages
  - `HelpText`: Static command help text
- **Hooks** (`hooks/`): Custom React hooks for state and behavior
  - `useReactionManager`: Manages emoji reactions, color modes, pending states, and API calls
  - `useKeyboardHandler`: Handles all keyboard input events including Shift+Tab and Delete/Backspace

**Type Definitions** (`src/types/`):

- `slack.ts`: Slack API response types and interfaces
- `ui.ts`: UI component types (ColorMode, TypedLetter with pending/removing states)
- `index.ts`: Barrel exports for all types

**Authentication Strategy**:

- **Cookie-only authentication**: Uses session cookie to extract token dynamically
- Priority: `SLACK_API_COOKIE` environment variable → .netrc file → error
- Workspace URL is automatically extracted from the Slack message URL (for archive format)
- .netrc format: `machine slack.com login <cookie-value>`
- Extracts Slack user tokens (xoxc-*) from workspace pages using session cookie
- For app.slack.com URLs, `SLACK_WORKSPACE_URL` environment variable is still required

**Cookie Setup**:
To get your Slack session cookie:
1. Open your Slack workspace in a web browser
2. Open developer tools (F12)
3. Go to Application/Storage → Cookies → your workspace domain
4. Find the cookie named `d` and copy its value
5. **Option A**: Set environment variable `SLACK_API_COOKIE=<cookie-value>`
6. **Option B**: Add to ~/.netrc file: `machine slack.com login <cookie-value>`
7. The workspace URL will be automatically extracted from archive-format URLs
8. For app.slack.com URLs, also set `SLACK_WORKSPACE_URL=https://yourworkspace.slack.com`

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
│   │   ├── slack-api.ts # Slack API client and reaction parsing
│   │   └── slack-url.ts # URL parsing utilities
│   ├── ui/              # User interface components
│   │   ├── app.tsx      # Main UI orchestrator component
│   │   ├── components/  # Reusable UI components
│   │   │   ├── index.ts # Component barrel exports
│   │   │   ├── MessageDisplay.tsx # Slack message display with timestamps
│   │   │   ├── InputBox.tsx       # Modern input box with pending states
│   │   │   ├── StatusMessage.tsx  # Status/error messages
│   │   │   └── HelpText.tsx       # Command help text
│   │   └── hooks/       # Custom React hooks
│   │       ├── index.ts           # Hook barrel exports
│   │       ├── useReactionManager.ts # Reaction state with pending/removing
│   │       └── useKeyboardHandler.ts # Keyboard input with Shift+Tab
│   └── types/           # TypeScript type definitions
│       ├── index.ts     # Barrel exports
│       ├── slack.ts     # Slack API types with reactions
│       └── ui.ts        # UI component types with states
├── deno.json            # Deno configuration
└── package.json         # Package metadata
```

## UI Architecture & Patterns

### Modern Pending State System

The application implements an elegant pending state system for all user interactions:

**Letter Addition Flow**:
1. User types letter → Letter appears dimmed immediately (pending: true)
2. Slack API call executes in background
3. On success → Letter brightens to normal color (pending: false)
4. On failure → Letter disappears with error message

**Letter Removal Flow**:
1. User presses backspace/delete → Last letter dims immediately (removing: true)
2. Slack API call executes in background  
3. On success → Letter disappears from UI
4. On failure → Letter un-dims and stays (removing: false) with error message

### TypedLetter State Management

The `TypedLetter` interface supports multiple states:
- `pending?: boolean` - Letter is being added to Slack
- `removing?: boolean` - Letter is being removed from Slack
- Both states render as dimmed colors in the UI

### Keyboard Handling

- **Shift+Tab**: Toggle color modes (white → orange → alternating → white)
- **Backspace OR Delete**: Remove last reaction (supports both key types)
- **Letters A-Z**: Add emoji reactions
- **Enter/Esc**: Exit application

### Existing Reaction Detection

On startup, the app automatically:
1. Parses existing alphabet emoji reactions from the Slack message
2. Reconstructs the typed letter sequence including duplicates
3. Displays "Found existing letters: XYZ" message for 3 seconds
4. Allows backspacing through pre-existing reactions

### Color System

- **White letters**: `white` (normal), `gray` (dimmed)
- **Orange letters**: `#FF8800` (normal), `#CC6600` (dimmed)
- Visual hierarchy clearly indicates processing state

### Build & Release

- **CI/CD**: All PRs run format checks, linting, type checking, tests, and build
  verification
- **Release**: Uses release-please for automated versioning based on
  conventional commits
- **Binaries**: Cross-platform compilation via GitHub Actions (Linux, macOS
  Intel/ARM, Windows)
- **Output**: Single binary with embedded dependencies (~22MB with React/Ink)
