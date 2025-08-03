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
  console.log(`🌐 Using workspace URL: ${finalWorkspaceUrl}`);
  
  if (!finalWorkspaceUrl) {
    throw new Error("Workspace URL is required when using SLACK_API_COOKIE. Either provide it in the Slack message URL or set SLACK_WORKSPACE_URL environment variable");
  }

  // Use the workspace URL directly like the Python script does
  const baseUrl = new URL(finalWorkspaceUrl);
  const rootUrl = `${baseUrl.protocol}//${baseUrl.hostname}`;

  try {
    const response = await fetch(rootUrl, {
      headers: {
        "Cookie": `d=${cookie}`,
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate, br",
        "DNT": "1",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1",
      },
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    
    // Extract token using regex pattern - prefer xoxc tokens
    const xoxcTokens = html.match(/xoxc-[\w-]+/g) || [];
    const xoxbTokens = html.match(/xoxb-[\w-]+/g) || [];
    const xoxpTokens = html.match(/xoxp-[\w-]+/g) || [];
    const xoxaTokens = html.match(/xoxa-[\w-]+/g) || [];
    
    const allTokens = [...xoxcTokens, ...xoxbTokens, ...xoxpTokens, ...xoxaTokens];
    if (allTokens.length > 0) {
      // Prefer xoxc tokens, but fall back to others
      const token = xoxcTokens[0] || allTokens[0];
      return token;
    }
    
    // Look for tokens in JavaScript boot data
    const bootDataMatch = html.match(/TD\.boot_data\s*=\s*{[\s\S]*?};/);
    if (bootDataMatch) {
      const bootData = bootDataMatch[0];
      const bootTokens = bootData.match(/(?:xox[a-z]-[\w-]+)/g) || [];
      if (bootTokens.length > 0 && bootTokens[0]) {
        return bootTokens[0];
      }
    }
    
    throw new Error("Could not find Slack token in workspace page");
  } catch (error) {
    throw new Error(`Failed to extract token from cookie: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export function getSlackCookie(): string | null {
  return Deno.env.get("SLACK_API_COOKIE") || null;
}
