# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Development Workflow

**CRITICAL: Always run these commands after making code changes:**

1. `deno fmt` - Format all files (auto-fixes formatting issues)
2. `deno task build` - Verify the project compiles without errors
3. `deno lint` - Check for linting issues (optional but recommended)
4. `deno check src/main.ts` - Type check the entire project (optional but
   recommended)

**Never commit changes without formatting and building first!**

## Common Commands

### Development

- `deno task dev <slack-message-url>` - Run the CLI tool in development mode
  with a Slack message URL
- `deno task fmt` - Format all TypeScript/TSX files
- `deno task build` - Compile to a single Linux binary (for testing builds)
- `deno check src/main.ts` - Type check the entire project

### Testing & Quality Checks

- `deno lint` - Lint TypeScript/TSX files using Deno's built-in linter
- `deno lint` - Lint TypeScript/TSX files using Deno's built-in linter
- `deno fmt --check` - Check if files are properly formatted (CI mode)

### Building for Release

- GitHub Actions handles cross-platform builds automatically on tag push
- Manual builds: Use `deno compile` with appropriate `--target` flags for
  different platforms
- Requires permissions: `--allow-net=slack.com --allow-env=SLACK_API_COOKIE`

## Architecture Overview

### Core Flow

1. **CLI Entry** (`main.ts` → `src/main.ts`): Parses command line args,
   authenticates, fetches message data
2. **Authentication** (`src/lib/auth.ts`): Handles cookie-based authentication
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
  - `useReactionManager`: Manages emoji reactions, color modes, pending states,
    and API calls
  - `useKeyboardHandler`: Handles all keyboard input events including Shift+Tab
    and Delete/Backspace

**Type Definitions** (`src/types/`):

- `slack.ts`: Slack API response types and interfaces
- `ui.ts`: UI component types (ColorMode, TypedLetter with pending/removing
  states)
- `index.ts`: Barrel exports for all types

**Authentication Strategy**:

- **Cookie-only authentication**: Uses session cookie to extract token
  dynamically
- Requires `SLACK_API_COOKIE` environment variable
- Workspace URL is automatically extracted from the Slack message URL

**Cookie Setup**: To get your Slack session cookie:

1. Open your Slack workspace in a web browser
2. Open developer tools (F12)
3. Go to Application/Storage → Cookies → your workspace domain
4. Find the cookie named `d` and copy its value
5. Set environment variable `SLACK_API_COOKIE=<cookie-value>`

### URL Format Support

- **Archives**: `https://workspace.slack.com/archives/CHANNEL/pTIMESTAMP`
- **Client**: `https://app.slack.com/client/TEAM/CHANNEL/MESSAGE`
- Timestamp conversion: `p1672534987000200` → `1672534987.000200`

### Emoji Naming Convention

- White letters: `:alphabet-white-a:` through `:alphabet-white-z:`
- Orange letters: `:alphabet-yellow-a:` through `:alphabet-yellow-z:`
- Two color modes: white and orange (no alternating mode)

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

The application implements an elegant pending state system for all user
interactions:

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

- **Shift+Tab**: Toggle color modes (white → orange)
- **Backspace OR Delete**: Remove last reaction (supports both key types)
- **Letters A-Z**: Add emoji reactions
- **Esc**: Exit application

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

- **CI/CD**: All PRs run format checks, linting, type checking, and build
  verification
- **Release**: Uses release-please for automated versioning based on
  conventional commits
- **Binaries**: Cross-platform compilation via GitHub Actions (Linux, macOS
  Intel/ARM, Windows)
- **Output**: Single binary with embedded dependencies (~22MB with React/Ink)

## Ink Documentation References

When working with Ink React terminal UI components, refer to these sources:

### Primary Documentation

- **Main Repository**: https://github.com/vadimdemedes/ink - Official Ink
  repository with API documentation
- **Ink 3 Features**: https://vadimdemedes.com/posts/ink-3 - Overview of Ink 3
  capabilities and improvements
- **Component Reference**:
  https://developerlife.com/2021/11/25/ink-v3-advanced-ui-components/ -
  Comprehensive guide to Ink v3.2.0 components with React, Node.js and
  TypeScript

### Border Styles & UI Components

- **Available borderStyle options**: `single`, `double`, `round`, `bold`,
  `singleDouble`, `doubleSingle`, `classic`
- **Border colors**: Use `borderColor` prop with any color value (hex, named
  colors)
- **Custom borders**: Pass custom border style objects with specific characters
  for each border segment
- **Round corners**: Use `borderStyle="round"` for rounded terminal borders
- **Thick borders**: Use `borderStyle="bold"` for thicker border lines

### Common UI Patterns

- **Input handling**: `useInput` hook for keyboard events
- **Focus management**: `useFocus` and `useFocusManager` hooks for tab
  navigation
- **Terminal dimensions**: `useStdout` hook for accessing stdout stream
- **App lifecycle**: `useApp` hook for exit control
