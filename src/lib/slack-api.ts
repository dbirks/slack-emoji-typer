import type {
  SlackApiResponse,
  SlackMessage,
  SlackUser,
  SlackReaction,
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
  const lowerLetter = letter.toLowerCase();
  const prefix = colorMode === "white" ? "alphabet-white-" : "alphabet-yellow-";
  return `${prefix}${lowerLetter}`;
}

export function parseExistingAlphabetReactions(reactions: SlackReaction[]): TypedLetter[] {
  const alphabetReactions: TypedLetter[] = [];
  
  // Process reactions in order to preserve sequence
  for (const reaction of reactions) {
    const match = reaction.name.match(/^alphabet-(white|yellow)-([a-z])$/);
    if (match) {
      const [, colorStr, letter] = match;
      const color = colorStr === "white" ? "white" : "orange";
      const upperLetter = letter.toUpperCase();
      const emojiName = getEmojiName(letter.toLowerCase(), color);
      
      alphabetReactions.push({
        char: upperLetter,
        color,
        emojiName,
      });
    }
  }
  
  return alphabetReactions;
}
