import type {
  SlackApiResponse,
  SlackMessage,
  SlackReaction,
  SlackUser,
} from "../types/slack.ts";
import type { TypedLetter } from "../types/index.ts";
import { getSlackCookie } from "./auth.ts";

export class SlackApiClient {
  private token: string;
  private cookie: string | null;
  private baseUrl = "https://slack.com/api";

  constructor(token: string) {
    this.token = token;
    this.cookie = getSlackCookie();
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      "Authorization": `Bearer ${this.token}`,
      "Content-Type": "application/json",
    };

    if (this.cookie) {
      headers["Cookie"] = `d=${this.cookie}`;
    }

    return headers;
  }

  async fetchMessage(
    channelId: string,
    messageTs: string,
  ): Promise<SlackApiResponse<SlackMessage>> {
    try {
      const url = new URL(`${this.baseUrl}/conversations.history`);
      url.searchParams.set("channel", channelId);
      url.searchParams.set("latest", messageTs);
      url.searchParams.set("inclusive", "true");
      url.searchParams.set("limit", "1");

      const response = await fetch(url.toString(), {
        headers: this.getHeaders(),
      });

      const data = await response.json();

      if (!data.ok) {
        return { ok: false, error: data.error || "Unknown error" };
      }

      if (!data.messages || data.messages.length === 0) {
        return { ok: false, error: "Message not found" };
      }

      return { ok: true, data: data.messages[0] };
    } catch (error) {
      return {
        ok: false,
        error: `Network error: ${
          error instanceof Error ? error.message : String(error)
        }`,
      };
    }
  }

  async fetchUser(userId: string): Promise<SlackApiResponse<SlackUser>> {
    try {
      const url = new URL(`${this.baseUrl}/users.info`);
      url.searchParams.set("user", userId);

      const response = await fetch(url.toString(), {
        headers: this.getHeaders(),
      });

      const data = await response.json();

      if (!data.ok) {
        return { ok: false, error: data.error || "Unknown error" };
      }

      return { ok: true, data: data.user };
    } catch (error) {
      return {
        ok: false,
        error: `Network error: ${
          error instanceof Error ? error.message : String(error)
        }`,
      };
    }
  }

  async fetchUsers(userIds: string[]): Promise<SlackApiResponse<SlackUser[]>> {
    try {
      // Fetch users in parallel
      const userPromises = userIds.map((userId) => this.fetchUser(userId));
      const userResults = await Promise.all(userPromises);

      const users: SlackUser[] = [];
      for (const result of userResults) {
        if (result.ok && result.data) {
          users.push(result.data);
        }
      }

      return { ok: true, data: users };
    } catch (error) {
      return {
        ok: false,
        error: `Network error: ${
          error instanceof Error ? error.message : String(error)
        }`,
      };
    }
  }

  async addReaction(
    channelId: string,
    messageTs: string,
    emojiName: string,
  ): Promise<SlackApiResponse<void>> {
    try {
      const response = await fetch(`${this.baseUrl}/reactions.add`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({
          channel: channelId,
          timestamp: messageTs,
          name: emojiName,
        }),
      });

      const data = await response.json();

      if (!data.ok) {
        return { ok: false, error: data.error || "Unknown error" };
      }

      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error: `Network error: ${
          error instanceof Error ? error.message : String(error)
        }`,
      };
    }
  }

  async removeReaction(
    channelId: string,
    messageTs: string,
    emojiName: string,
  ): Promise<SlackApiResponse<void>> {
    try {
      const response = await fetch(`${this.baseUrl}/reactions.remove`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({
          channel: channelId,
          timestamp: messageTs,
          name: emojiName,
        }),
      });

      const data = await response.json();

      if (!data.ok) {
        return { ok: false, error: data.error || "Unknown error" };
      }

      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error: `Network error: ${
          error instanceof Error ? error.message : String(error)
        }`,
      };
    }
  }
}

export function getEmojiName(
  letter: string,
  colorMode: "white" | "orange",
): string {
  const prefix = colorMode === "white" ? "alphabet-white-" : "alphabet-yellow-";

  // Handle special symbols
  const symbolMap: Record<string, string> = {
    "@": "at",
    "!": "exclamation",
    "?": "question",
    "#": "hash",
  };

  const normalizedChar = symbolMap[letter] || letter.toLowerCase();
  return `${prefix}${normalizedChar}`;
}

export function extractUserIdsFromText(text: string): string[] {
  const userMentionRegex = /<@([A-Z0-9]+)>/g;
  const userIds: string[] = [];
  let match;

  while ((match = userMentionRegex.exec(text)) !== null) {
    const userId = match[1];
    if (!userIds.includes(userId)) {
      userIds.push(userId);
    }
  }

  return userIds;
}

export async function resolveUserMentions(
  text: string,
  slackClient: SlackApiClient,
): Promise<string> {
  const userIds = extractUserIdsFromText(text);

  if (userIds.length === 0) {
    return text;
  }

  const usersResult = await slackClient.fetchUsers(userIds);
  if (!usersResult.ok || !usersResult.data) {
    return text; // Return original text if we can't fetch users
  }

  let resolvedText = text;
  for (const user of usersResult.data) {
    const displayName = user.real_name || user.profile?.real_name || user.name;
    const userMentionRegex = new RegExp(`<@${user.id}>`, "g");
    resolvedText = resolvedText.replace(userMentionRegex, `@${displayName}`);
  }

  return resolvedText;
}

export async function resolveUserMentionsWithColors(
  text: string,
  slackClient: SlackApiClient,
): Promise<{ text: string; userColors: Map<string, string> }> {
  const userIds = extractUserIdsFromText(text);

  if (userIds.length === 0) {
    return { text, userColors: new Map() };
  }

  const usersResult = await slackClient.fetchUsers(userIds);
  if (!usersResult.ok || !usersResult.data) {
    return { text, userColors: new Map() }; // Return original text if we can't fetch users
  }

  const mentionColors = ["#5B9BD5"]; // just blue
  const userColors = new Map<string, string>();
  let resolvedText = text;
  let colorIndex = 0;

  for (const user of usersResult.data) {
    const displayName = user.real_name || user.profile?.real_name || user.name;
    const userMentionRegex = new RegExp(`<@${user.id}>`, "g");
    const mentionText = `@${displayName}`;
    
    resolvedText = resolvedText.replace(userMentionRegex, mentionText);
    userColors.set(mentionText, mentionColors[colorIndex % mentionColors.length]);
    colorIndex++;
  }

  return { text: resolvedText, userColors };
}

export function parseExistingAlphabetReactions(
  reactions: SlackReaction[],
): TypedLetter[] {
  const alphabetReactions: TypedLetter[] = [];

  // Reverse symbol map for parsing
  const reverseSymbolMap: Record<string, string> = {
    "at": "@",
    "exclamation": "!",
    "question": "?",
    "hash": "#",
  };

  // Process reactions in order to preserve sequence
  for (const reaction of reactions) {
    const match = reaction.name.match(/^alphabet-(white|yellow)-([a-z]+)$/);
    if (match) {
      const [, colorStr, emojiSuffix] = match;
      const color = colorStr === "white" ? "white" : "orange";

      // Convert emoji suffix back to character
      const char = reverseSymbolMap[emojiSuffix] || emojiSuffix.toUpperCase();
      const emojiName = reaction.name;

      // Handle reactions with count > 1 (duplicate characters)
      for (let i = 0; i < reaction.count; i++) {
        alphabetReactions.push({
          char,
          color,
          emojiName,
        });
      }
    }
  }

  return alphabetReactions;
}
