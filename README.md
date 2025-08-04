# Slack Emoji Typer 🎉

A cross-platform CLI tool that lets you add letter-reaction emoji to Slack
messages by typing on your keyboard. Built with Deno and TypeScript, featuring
an interactive React-based CLI interface powered by Ink.

## Features

- 🚀 **Interactive typing**: Type letters to add emoji reactions in real-time
- 🎨 **Multiple emoji styles**: Switch between white, orange, and alternating
  letter emojis
- ⌨️ **Intuitive controls**: Backspace to undo, Ctrl+T to toggle styles
- 🔐 **Secure authentication**: Support for environment variables and .netrc
  files
- 📦 **Single binary**: No dependencies to install, just download and run
- 🌍 **Cross-platform**: Available for Linux, macOS (Intel & Apple Silicon), and
  Windows

## Quick Start

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

Requirements: [Deno](https://deno.com/) 1.x

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

### Option 2: .netrc File

Add to your `~/.netrc` file:

```
machine slack.com login xoxd-your-cookie-here
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

### Controls

Once the interactive mode starts:

- **Letter keys (A-Z) and symbols (@!?#)**: Add corresponding emoji reactions
- **Backspace**: Remove the last emoji reaction
- **Ctrl+T**: Toggle emoji color mode (White → Orange → Alternating → White)
- **Enter/Esc**: Exit the application
- **Backspace on empty**: Exit the application

### Color Modes

- **White**: Uses `:alphabet-white-a:`, `:alphabet-white-b:`, etc.
- **Orange**: Uses `:alphabet-yellow-a:`, `:alphabet-yellow-b:`, etc.
- **Alternating**: Alternates between white and orange for each letter

## URL Formats

The tool supports these Slack message URL formats:

### Archives Format (most common)

```
https://yourworkspace.slack.com/archives/C12345678/p1672534987000200
```

### Client Format

```
https://app.slack.com/client/T12345/C12345678/messageId
```

To get a message URL:

1. Right-click on any Slack message
2. Select "Copy link"
3. Use the copied URL with this tool

## Requirements

### Slack Workspace Setup

Your Slack workspace must have alphabet emoji packs installed. The tool looks
for emojis named:

- `:alphabet-white-a:` through `:alphabet-white-z:`
- `:alphabet-yellow-a:` through `:alphabet-yellow-z:`
- `:alphabet-white-at:`, `:alphabet-white-exclamation:`, `:alphabet-white-question:`, `:alphabet-white-hash:`
- `:alphabet-yellow-at:`, `:alphabet-yellow-exclamation:`, `:alphabet-yellow-question:`, `:alphabet-yellow-hash:`

If these emojis don't exist, you'll get "invalid_name" errors.

### Permissions

You need:

- Access to the channel containing the message
- Permission to add reactions in that channel
- The message must exist and be reactable

## Development

### Prerequisites

- [Deno](https://deno.com/) 1.x
- A Slack workspace with alphabet emoji packs

### Setup

```bash
git clone https://github.com/your-username/slack-emoji-typer.git
cd slack-emoji-typer
```

### Run in Development

```bash
deno task dev "https://your-slack-message-url"
```

### Build

```bash
deno task build
```

### Format Code

```bash
deno task fmt
```

### Project Structure

```
├── main.ts           # CLI entry point
├── app.tsx           # Interactive UI components (Ink/React)
├── auth.ts           # Authentication handling
├── slack-api.ts      # Slack API client
├── slack-url.ts      # URL parsing utilities
├── deno.json         # Deno configuration
├── package.json      # Package metadata for release-please
└── .github/
    └── workflows/    # CI/CD automation
```

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
