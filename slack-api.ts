export interface SlackMessage {
  text: string;
  user: string;
  ts: string;
}

export interface SlackUser {
  id: string;
  name: string;
  real_name: string;
  profile: {
    display_name: string;
    real_name: string;
  };
}

export interface SlackApiError {
  ok: false;
  error: string;
}

export interface SlackApiSuccess<T> {
  ok: true;
  data?: T;
}

export type SlackApiResponse<T> = SlackApiSuccess<T> | SlackApiError;

export class SlackApiClient {
  private token: string;
  private baseUrl = "https://slack.com/api";

  constructor(token: string) {
    this.token = token;
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
        headers: {
          "Authorization": `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
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
      return { ok: false, error: `Network error: ${error instanceof Error ? error.message : String(error)}` };
    }
  }

  async fetchUser(userId: string): Promise<SlackApiResponse<SlackUser>> {
    try {
      const url = new URL(`${this.baseUrl}/users.info`);
      url.searchParams.set("user", userId);

      const response = await fetch(url.toString(), {
        headers: {
          "Authorization": `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!data.ok) {
        return { ok: false, error: data.error || "Unknown error" };
      }

      return { ok: true, data: data.user };
    } catch (error) {
      return { ok: false, error: `Network error: ${error instanceof Error ? error.message : String(error)}` };
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
        headers: {
          "Authorization": `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
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
      return { ok: false, error: `Network error: ${error instanceof Error ? error.message : String(error)}` };
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
        headers: {
          "Authorization": `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
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
      return { ok: false, error: `Network error: ${error instanceof Error ? error.message : String(error)}` };
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
