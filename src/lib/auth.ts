export async function getSlackToken(workspaceUrl?: string): Promise<string> {
  // First, try environment variable
  let cookie = Deno.env.get("SLACK_API_COOKIE");
  
  // If not found, try .netrc file
  if (!cookie) {
    try {
      const homeDir = Deno.env.get("HOME") || Deno.env.get("USERPROFILE");
      if (!homeDir) {
        throw new Error("Could not determine home directory");
      }

      const netrcPath = `${homeDir}/.netrc`;
      const netrcContent = await Deno.readTextFile(netrcPath);
      cookie = parseNetrcForSlack(netrcContent) || undefined;
    } catch (_error) {
      // .netrc file doesn't exist or can't be read
    }
  }

  if (!cookie) {
    throw new Error(
      "Slack cookie not found. Please set SLACK_API_COOKIE environment variable or add to ~/.netrc file.\n" +
      "To get your cookie:\n" +
      "1. Open your Slack workspace in a browser\n" +
      "2. Open developer tools (F12)\n" +
      "3. Go to Application/Storage → Cookies → your workspace domain\n" +
      "4. Find the cookie named 'd' and copy its value\n" +
      "5. Either set SLACK_API_COOKIE=<cookie-value> or add to ~/.netrc:\n" +
      "   machine slack.com login <cookie-value>"
    );
  }

  try {
    const token = await extractTokenFromCookie(cookie, workspaceUrl);
    return token;
  } catch (error) {
    throw new Error(`Cookie authentication failed: ${error instanceof Error ? error.message : String(error)}`);
  }
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

async function extractTokenFromCookie(cookie: string, workspaceUrl?: string): Promise<string> {
  // Use provided workspace URL or fall back to environment variable
  const finalWorkspaceUrl = workspaceUrl || Deno.env.get("SLACK_WORKSPACE_URL");
  if (!finalWorkspaceUrl) {
    throw new Error("Workspace URL is required when using SLACK_API_COOKIE. Either provide it in the Slack message URL or set SLACK_WORKSPACE_URL environment variable");
  }

  try {
    const response = await fetch(finalWorkspaceUrl, {
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
