export async function getSlackToken(): Promise<string> {
  // First, try cookie-based authentication
  const cookie = Deno.env.get("SLACK_API_COOKIE");
  if (cookie) {
    try {
      const token = await extractTokenFromCookie(cookie);
      return token;
    } catch (error) {
      console.warn("Cookie-based auth failed:", error instanceof Error ? error.message : String(error));
    }
  }

  // Second, try environment variable
  const envToken = Deno.env.get("SLACK_TOKEN");
  if (envToken) {
    return envToken;
  }

  // If not found, try .netrc file
  try {
    const homeDir = Deno.env.get("HOME") || Deno.env.get("USERPROFILE");
    if (!homeDir) {
      throw new Error("Could not determine home directory");
    }

    const netrcPath = `${homeDir}/.netrc`;
    const netrcContent = await Deno.readTextFile(netrcPath);

    // Parse .netrc file to find slack.com entry
    const token = parseNetrcForSlack(netrcContent);
    if (token) {
      return token;
    }
  } catch (_error) {
    // .netrc file doesn't exist or can't be read, continue to error
  }

  throw new Error(
    "Slack token not found. Please set SLACK_API_COOKIE environment variable, " +
      "SLACK_TOKEN environment variable, or add credentials to ~/.netrc file.\n" +
      "For .netrc, add line: machine slack.com login your-token-here",
  );
}

function parseNetrcForSlack(content: string): string | null {
  const lines = content.split(/\r?\n/);
  let inSlackMachine = false;
  let token: string | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const parts = trimmed.split(/\s+/);

    if (parts[0] === "machine" && parts[1] === "slack.com") {
      inSlackMachine = true;
      continue;
    }

    if (inSlackMachine) {
      if (parts[0] === "machine") {
        // Started a new machine block, stop looking
        break;
      }

      if (parts[0] === "login" && parts[1]) {
        token = parts[1];
        break;
      }
    }
  }

  return token;
}

async function extractTokenFromCookie(cookie: string): Promise<string> {
  // We need a workspace URL to extract the token from
  // For now, we'll need the user to provide both cookie and workspace URL
  const workspaceUrl = Deno.env.get("SLACK_WORKSPACE_URL");
  if (!workspaceUrl) {
    throw new Error("SLACK_WORKSPACE_URL environment variable is required when using SLACK_API_COOKIE");
  }

  try {
    const response = await fetch(workspaceUrl, {
      headers: {
        "Cookie": `d=${cookie}`,
        "User-Agent": "Mozilla/5.0 (compatible; slack-emoji-typer)",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    
    // Extract token using regex pattern for xoxc- tokens
    const tokenMatch = html.match(/xoxc-[\w-]+/);
    if (!tokenMatch) {
      throw new Error("Could not find Slack token in workspace page");
    }

    return tokenMatch[0];
  } catch (error) {
    throw new Error(`Failed to extract token from cookie: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export function getSlackCookie(): string | null {
  return Deno.env.get("SLACK_API_COOKIE") || null;
}
