export async function getSlackToken(workspaceUrl?: string): Promise<string> {
  // Get Slack session cookie from environment variable
  const cookie = Deno.env.get("SLACK_API_COOKIE");

  if (!cookie) {
    throw new Error(
      "Slack cookie not found. Please set SLACK_API_COOKIE environment variable.\n" +
        "To get your cookie:\n" +
        "1. Open your Slack workspace in a browser\n" +
        "2. Open developer tools (F12)\n" +
        "3. Go to Application/Storage → Cookies → your workspace domain\n" +
        "4. Find the cookie named 'd' and copy its value\n" +
        "5. Set SLACK_API_COOKIE=<cookie-value>",
    );
  }

  try {
    const token = await extractTokenFromCookie(cookie, workspaceUrl);
    return token;
  } catch (error) {
    throw new Error(
      `Cookie authentication failed: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
}

async function extractTokenFromCookie(
  cookie: string,
  workspaceUrl?: string,
): Promise<string> {
  // Use provided workspace URL or fall back to environment variable
  const finalWorkspaceUrl = workspaceUrl || Deno.env.get("SLACK_WORKSPACE_URL");

  if (!finalWorkspaceUrl) {
    throw new Error(
      "Workspace URL is required when using SLACK_API_COOKIE. Either provide it in the Slack message URL or set SLACK_WORKSPACE_URL environment variable",
    );
  }

  // Use the workspace URL directly like the Python script does
  const baseUrl = new URL(finalWorkspaceUrl);
  const rootUrl = `${baseUrl.protocol}//${baseUrl.hostname}`;

  try {
    const response = await fetch(rootUrl, {
      headers: {
        "Cookie": `d=${cookie}`,
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept":
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
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

    const allTokens = [
      ...xoxcTokens,
      ...xoxbTokens,
      ...xoxpTokens,
      ...xoxaTokens,
    ];
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
    throw new Error(
      `Failed to extract token from cookie: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
}

export function getSlackCookie(): string | null {
  return Deno.env.get("SLACK_API_COOKIE") || null;
}
