<div align="center">

# slack-emoji-typer

<img src="docs/recording.gif" alt="slack-emoji-typer demo" width="800">

</div>
<br />

Have you ever wanted to be annoying in Slack and spell out whole words using the
alphabet emojis, but found it too tiresome to click through the emoji menus over
and over? Oh wait, never? 😅

<div align="center">
Introducing: 🎺 `slack-emoji-typer` 🎺
</div>

Now you can type letters on your keyboard to instantly add alphabet emoji
reactions to any Slack message, with amazingly incredible real-time visual
feedback and wonderfully remarkably intuitive controls.

## Table of Contents

- [slack-emoji-typer](#slack-emoji-typer)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Quick Start](#quick-start)
  - [Installation](#installation)
    - [Download Binary](#download-binary)
    - [Build from Source](#build-from-source)
  - [Authentication](#authentication)
    - [Set Environment Variable](#set-environment-variable)
    - [Getting Your Slack Cookie](#getting-your-slack-cookie)
  - [Usage](#usage)
    - [Basic Usage](#basic-usage)
    - [Controls](#controls)
    - [Color Modes](#color-modes)
  - [Technology Stack](#technology-stack)
    - [Core Runtime](#core-runtime)
    - [User Interface](#user-interface)
  - [Development](#development)
    - [Prerequisites](#prerequisites)
    - [Available Commands](#available-commands)
    - [Project Structure](#project-structure)
  - [Release Process](#release-process)
  - [Changelog](#changelog)

## Features

- 🚀 **Interactive typing**: Type letters to add emoji reactions in real-time
- 🎨 **Multiple emoji styles**: Switch between white and orange letter emojis
- ⌨️ **Intuitive controls**: Backspace to undo, Shift+Tab to toggle styles
- 📦 **Single binary**: No dependencies to install, just download and run
- 🌍 **Cross-platform**: Available for Linux, macOS (Intel & Apple Silicon), and
  Windows

## Quick Start

1. **Download** the latest binary for your platform from
   [Releases](../../releases)
2. **Get your Slack cookie** (see [Authentication](#authentication) below)
3. **Run** the tool with a Slack message URL:

```bash
slack-emoji-typer "https://yourworkspace.slack.com/archives/C12345678/p1672534987000200"
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

Requirements: [Deno](https://deno.com/)

```bash
deno task build
```

## Authentication

You need a Slack session cookie to use this tool. The cookie should start with
`xoxd-`.

### Set Environment Variable

```bash
export SLACK_API_COOKIE="xoxd-your-cookie-here"
```

### Getting Your Slack Cookie

1. Open your Slack workspace in a web browser
2. Open Developer Tools (F12)
3. Go to Application/Storage → Cookies
4. Find the cookie named `d` and copy its value
5. The cookie value starts with `xoxd-`

## Usage

### Basic Usage

```bash
slack-emoji-typer https://yourworkspace.slack.com/archives/C12345678/p1672534987000200
```

**Getting a Slack message URL**: Right-click on any Slack message and select
"Copy link", then use the copied URL with this tool.

### Controls

Once the interactive mode starts:

- **Letter keys (A-Z)**: Add corresponding emoji reactions
- **Symbol keys (@!?#)**: Add corresponding symbol emoji reactions
- **Backspace**: Remove the last emoji reaction
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

## Development

### Prerequisites

- [Deno](https://deno.com/) 2.x
- A Slack workspace with alphabet emoji packs (any Slack workspace I believe)

### Available Commands

```bash
# Run in development mode with a Slack message URL
deno task dev https://your-slack-message-url

# Build the project (creates binary)
deno task build

# Format code with Deno's built-in formatter
deno task fmt

# Lint code
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

## Release Process

This project uses automated releases via GitHub Actions:

1. Commit changes using [Conventional Commits](https://conventionalcommits.org/)
2. Push/merge to main branch
3. Release Please will create a PR with version bump and changelog
4. Merge the PR to trigger automatic binary builds and a GitHub Release

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.

---

**Note**: This tool is unofficial and definitely not affiliated with Slack
Technologies. Use responsibly and in accordance with your organization's Slack
policies.
