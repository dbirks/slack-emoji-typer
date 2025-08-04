export type ColorMode = "white" | "orange";

export interface TypedLetter {
  char: string;
  color: "white" | "orange";
  emojiName: string;
  pending?: boolean;
  removing?: boolean;
}
