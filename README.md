# Slack Emoji Typer 🎉

A cross-platform CLI tool that transforms your keyboard into an emoji reaction
machine for Slack messages. Type letters to instantly add alphabet emoji
reactions to any Slack message, with real-time visual feedback and intuitive
controls.

Perfect for spelling out words, names, or messages using Slack's alphabet emoji
reactions - no more tedious clicking through emoji menus!

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Authentication](#authentication)
- [Usage](#usage)
- [Technology Stack](#technology-stack)
- [Requirements](#requirements)
- [Development](#development)
- [Error Handling](#error-handling)
- [Contributing](#contributing)

## Features

- 🚀 **Interactive typing**: Type letters to add emoji reactions in real-time
- 🎨 **Multiple emoji styles**: Switch between white, orange, and alternating
  letter emojis
- ⌨️ **Intuitive controls**: Backspace to undo, Shift+Tab to toggle styles
- 🔐 **Secure authentication**: Cookie-based authentication with environment
  variables
- 📦 **Single binary**: No dependencies to install, just download and run
- 🌍 **Cross-platform**: Available for Linux, macOS (Intel & Apple Silicon), and
  Windows

## Quick Start

**⚠️ Prerequisites**: Your Slack workspace must have alphabet emoji packs
installed (`:alphabet-white-a:` through `:alphabet-white-z:` and
`:alphabet-yellow-a:` through `:alphabet-yellow-z:`). If these don't exist,
you'll get "invalid_name" errors.

1. **Download** the latest binary for your platform from
   [Releases](../../releases)
2. **Get your Slack cookie** (see [Authentication](#authentication) below)
3. **Run** the tool with a Slack message URL:

```bash
./slack-emoji-typer "https://yourworkspace.slack.com/archives/C12345678/p1672534987000200"
```

## Installation

### Download Binary

Download the appropriate binary for your platform from the
[Releases](../../releases) page:

- **Linux**: `slack-emoji-typer-linux`
- **macOS (Intel)**: `slack-emoji-typer-macos`
- **macOS (Apple Silicon)**: `slack-emoji-typer-macos-arm64`
- **Windows**: `slack-emoji-typer-windows.exe`

Make it executable:

```bash
chmod +x slack-emoji-typer-*
```

### Build from Source

Requirements: [Deno](https://deno.com/) 2.x

```bash
git clone https://github.com/your-username/slack-emoji-typer.git
cd slack-emoji-typer
deno task build
```

## Authentication

You need a Slack session cookie to use this tool. The cookie should start with
`xoxd-`.

### Option 1: Environment Variable

```bash
export SLACK_API_COOKIE="xoxd-your-cookie-here"
```

### Getting Your Slack Cookie

⚠️ **Security Warning**: Keep your cookie secret and never share it.

1. Open your Slack workspace in a web browser
2. Open Developer Tools (F12)
3. Go to Application/Storage → Cookies → your workspace domain
4. Find the cookie named `d` and copy its value
5. The cookie value starts with `xoxd-`

## Usage

### Basic Usage

```bash
slack-emoji-typer "https://yourworkspace.slack.com/archives/C12345678/p1672534987000200"
```

**Getting a Slack message URL**: Right-click on any Slack message and select
"Copy link", then use the copied URL with this tool.

### Controls

Once the interactive mode starts:

- **Letter keys (A-Z)**: Add corresponding emoji reactions
- **Symbol keys (@!?#)**: Add corresponding symbol emoji reactions
- **Backspace/Delete**: Remove the last emoji reaction
- **Shift+Tab**: Toggle emoji color mode (White → Orange)
- **Esc**: Exit the application

### Color Modes

- **White**: Uses `:alphabet-white-a:`, `:alphabet-white-b:`, etc.
- **Orange**: Uses `:alphabet-yellow-a:`, `:alphabet-yellow-b:`, etc.

## Technology Stack

This project leverages modern web technologies adapted for the command line:

### Core Runtime

- **[Deno](https://deno.com/)** - Modern JavaScript/TypeScript runtime with
  built-in security, native TypeScript support, and comprehensive toolchain
  (linter, formatter, test runner)
- **TypeScript** - Type-safe development with zero configuration needed

### User Interface

- **[React](https://react.dev/)** - Component-based UI architecture using
  familiar hooks and patterns
- **[Ink](https://github.com/vadimdemedes/ink)** - React renderer for terminal
  interfaces, enabling rich CLI experiences with Flexbox layouts and CSS-like
  styling

### Architecture

- **Component-based design** - Modular UI components (MessageDisplay, InputBox,
  StatusMessage)
- **Custom React hooks** - `useKeyboardHandler` for input management,
  `useReactionManager` for Slack API interactions
- **Type-safe API layer** - Strongly-typed Slack API client with comprehensive
  error handling
- **Cookie-based authentication** - Secure session-based auth without requiring
  bot tokens

### Build & Distribution

- **Single binary compilation** - Zero-dependency executables for all platforms
- **Cross-platform builds** - Automated CI/CD with GitHub Actions
- **Automated releases** - Conventional commits with release-please for version
  management

## Requirements

### Permissions

You need:

- Access to the channel containing the message
- Permission to add reactions in that channel
- The message must exist and be reactable

## Development

### Prerequisites

- [Deno](https://deno.com/) 2.x
- A Slack workspace with alphabet emoji packs

### Setup

```bash
git clone https://github.com/your-username/slack-emoji-typer.git
cd slack-emoji-typer

# Set up your Slack cookie for testing
export SLACK_API_COOKIE="xoxd-your-cookie-here"
```

### Available Commands

```bash
# Run in development mode with a Slack message URL
deno task dev "https://your-slack-message-url"

# Build the project (creates binary)  
deno task build

# Format code with Deno's built-in formatter
deno task fmt

# Type-check the entire project
deno check src/main.ts

# Lint code (optional but recommended)
deno lint
```

### Project Structure

```
slack-emoji-typer/
├── main.ts                      # Root CLI entry point
├── src/
│   ├── main.ts                  # Core application logic  
│   ├── lib/                     # Business logic layer
│   │   ├── auth.ts              # Cookie-based authentication
│   │   ├── slack-api.ts         # Slack API client & reactions
│   │   ├── slack-url.ts         # URL parsing utilities
│   │   └── index.ts             # Library exports
│   ├── ui/                      # React/Ink interface layer
│   │   ├── app.tsx              # Main UI orchestrator
│   │   ├── components/          # Reusable UI components
│   │   │   ├── MessageDisplay.tsx   # Slack message display
│   │   │   ├── InputBox.tsx         # Typed input visualization  
│   │   │   ├── StatusMessage.tsx    # Status & error messages
│   │   │   └── HelpText.tsx         # Command help display
│   │   └── hooks/               # Custom React hooks
│   │       ├── useKeyboardHandler.ts    # Input event handling
│   │       └── useReactionManager.ts    # Slack API interactions
│   └── types/                   # TypeScript definitions
│       ├── slack.ts             # Slack API types
│       └── ui.ts                # UI component types
├── deno.json                    # Deno configuration & tasks
├── package.json                 # Package metadata for releases
└── .github/
    └── workflows/               # CI/CD automation
        ├── ci.yml               # Pull request checks
        ├── release.yml          # Binary builds & releases  
        └── release-please.yml   # Automated version management
```

### Development Workflow

1. **Make changes** to source files in `src/`
2. **Test locally** with `deno task dev <slack-url>`
3. **Format code** with `deno task fmt`
4. **Build & verify** with `deno task build`
5. **Commit using conventional commits** (e.g., `feat:`, `fix:`, `docs:`)

The compiled binary will be created as `./slack-emoji-typer` and includes all
dependencies.

## Error Handling

The tool provides clear error messages for common issues:

- **Authentication failed**: Check your cookie validity
- **Channel not found**: Verify channel access and URL
- **Message not found**: Check if message exists and URL is correct
- **Emoji not found**: Ensure alphabet emoji packs are installed
- **Already reacted**: You've already added that emoji
- **Network errors**: Check internet connection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Use conventional commits (e.g., `feat:`, `fix:`, `docs:`)
5. Submit a pull request

## Release Process

This project uses automated releases via GitHub Actions:

1. Commit changes using [Conventional Commits](https://conventionalcommits.org/)
2. Push to main branch
3. Release Please will create a PR with version bump and changelog
4. Merge the PR to trigger automatic binary builds and GitHub release

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.

---

**Note**: This tool is unofficial and not affiliated with Slack Technologies.
Use responsibly and in accordance with your organization's Slack policies.
