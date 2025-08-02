import type { SlackMessageInfo } from "../types/slack.ts";

export function parseSlackUrl(url: string): SlackMessageInfo {
  try {
    const parsedUrl = new URL(url);

    // Handle archives format: https://workspace.slack.com/archives/C12345678/p1672534987000200
    if (parsedUrl.pathname.includes("/archives/")) {
      const pathParts = parsedUrl.pathname.split("/");
      const archivesIndex = pathParts.indexOf("archives");

      if (archivesIndex === -1 || archivesIndex + 2 >= pathParts.length) {
        throw new Error("Invalid Slack archives URL format");
      }

      const channelId = pathParts[archivesIndex + 1];
      const messageId = pathParts[archivesIndex + 2];

      if (!channelId || !messageId.startsWith("p")) {
        throw new Error("Invalid Slack message URL format");
      }

      const messageTs = parseSlackTimestamp(messageId);
      return { channelId, messageTs };
    }

    // Handle client format: https://app.slack.com/client/T12345/C12345678/messageId
    if (
      parsedUrl.hostname === "app.slack.com" &&
      parsedUrl.pathname.includes("/client/")
    ) {
      const pathParts = parsedUrl.pathname.split("/");
      if (pathParts.length >= 5 && pathParts[1] === "client") {
        const channelId = pathParts[3];
        const messageId = pathParts[4];

        if (!channelId || !messageId) {
          throw new Error("Invalid Slack client URL format");
        }

        // For client URLs, the messageId might already be a timestamp
        const messageTs = messageId.startsWith("p")
          ? parseSlackTimestamp(messageId)
          : messageId;
        return { channelId, messageTs };
      }
    }

    throw new Error("Unsupported Slack URL format");
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("Invalid URL format");
    }
    throw error;
  }
}

function parseSlackTimestamp(messageId: string): string {
  if (!messageId.startsWith("p")) {
    throw new Error("Invalid Slack message ID format");
  }

  const raw = messageId.slice(1); // Remove leading 'p'

  if (raw.length < 10) {
    throw new Error("Invalid Slack timestamp format");
  }

  const seconds = raw.slice(0, 10);
  const microseconds = raw.slice(10);

  return `${seconds}.${microseconds}`;
}

export function extractWorkspaceUrl(url: string): string | null {
  try {
    const parsedUrl = new URL(url);

    // Handle archives format: https://workspace.slack.com/archives/...
    // Extract just the base URL (protocol + hostname) without any path
    if (parsedUrl.pathname.includes("/archives/")) {
      return `${parsedUrl.protocol}//${parsedUrl.hostname}`;
    }

    // Handle client format: https://app.slack.com/client/T12345/...
    // For client URLs, we can't easily determine the workspace URL
    // since they use app.slack.com, so we'll need to rely on env var
    if (parsedUrl.hostname === "app.slack.com") {
      return null; // Indicate we need SLACK_WORKSPACE_URL from environment
    }

    // Generic slack.com domain handling - always return just the base URL
    if (parsedUrl.hostname.endsWith(".slack.com")) {
      return `${parsedUrl.protocol}//${parsedUrl.hostname}`;
    }

    return null; // Can't determine workspace URL
  } catch (error) {
    return null;
  }
}
