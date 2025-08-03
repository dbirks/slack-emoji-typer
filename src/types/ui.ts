export type ColorMode = "white" | "orange" | "alternate";

export interface TypedLetter {
  char: string;
  color: "white" | "orange";
  emojiName: string;
  pending?: boolean;
}
