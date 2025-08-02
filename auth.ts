export async function getSlackToken(): Promise<string> {
  // First, try environment variable
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
    "Slack token not found. Please set SLACK_TOKEN environment variable or add credentials to ~/.netrc file.\n" +
      "For .netrc, add line: machine slack.com login your-token-here password dummy",
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
