export interface SlackReaction {
  name: string;
  users: string[];
  count: number;
}

export interface SlackMessage {
  text: string;
  user: string;
  ts: string;
  reactions?: SlackReaction[];
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

export interface SlackMessageInfo {
  channelId: string;
  messageTs: string;
}
