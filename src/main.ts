import { getSlackToken, parseSlackUrl, extractWorkspaceUrl, SlackApiClient } from "./lib/index.ts";
import { renderApp } from "./ui/app.tsx";

export async function main() {
  try {
    // Get Slack message URL from command line arguments
    const args = Deno.args;
    if (args.length === 0) {
      console.error("Usage: slack-emoji-typer <slack-message-url>");
      console.error(
        "Example: slack-emoji-typer https://yourworkspace.slack.com/archives/C12345678/p1672534987000200",
      );
      Deno.exit(1);
    }

    const slackUrl = args[0];

    // Parse the Slack URL to extract channel ID and message timestamp
    const { channelId, messageTs } = parseSlackUrl(slackUrl);

    // Extract workspace URL from the Slack URL for cookie authentication  
    const workspaceUrl = extractWorkspaceUrl(slackUrl);

    // Get Slack authentication token
    const token = await getSlackToken(workspaceUrl || undefined);

    // Initialize Slack API client
    const slackClient = new SlackApiClient(token);

    // Fetch the message details
    const messageResult = await slackClient.fetchMessage(channelId, messageTs);

    if (!messageResult.ok) {
      handleSlackError("fetching message", messageResult.error);
      return;
    }

    const message = messageResult.data!;

    // Fetch user details for the message author
    const userResult = await slackClient.fetchUser(message.user);

    if (!userResult.ok) {
      console.error(
        `Warning: Could not fetch user details: ${userResult.error}`,
      );
      console.error("Continuing with user ID instead of name...");
    }

    const author = userResult.ok ? userResult.data! : {
      id: message.user,
      name: message.user,
      real_name: message.user,
      profile: { display_name: message.user, real_name: message.user },
    };

    // Clear console and start the interactive UI
    console.clear();
    console.log("🎉 Ready! Starting interactive mode...\n");

    // Render the interactive UI
    await renderApp(slackClient, channelId, messageTs, message, author);

    console.log("\n👋 Goodbye!");
  } catch (error) {
    console.error(
      `❌ Error: ${error instanceof Error ? error.message : String(error)}`,
    );
    Deno.exit(1);
  }
}

function handleSlackError(operation: string, error: string) {
  console.error(`❌ Error ${operation}:`);

  switch (error) {
    case "invalid_auth":
    case "not_authed":
      console.error(
        "Authentication failed. Please check your Slack token (it may be expired or invalid).",
      );
      console.error(
        "Make sure to set SLACK_TOKEN environment variable or add credentials to ~/.netrc",
      );
      break;

    case "channel_not_found":
      console.error(
        "Channel not found. Make sure you have access to the channel and the URL is correct.",
      );
      break;

    case "not_in_channel":
      console.error(
        "You are not a member of this channel. Please join the channel in Slack first.",
      );
      break;

    case "message_not_found":
      console.error(
        "Message not found. The message may have been deleted or the URL is incorrect.",
      );
      break;

    default:
      console.error(`Slack API error: ${error}`);
  }

  Deno.exit(1);
}
