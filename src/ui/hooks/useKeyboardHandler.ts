import { useInput } from "ink";

interface UseKeyboardHandlerProps {
  isProcessing: boolean;
  onToggleColorMode: () => void;
  onRemoveLastReaction: () => void;
  onExit: () => void;
  onAddReaction: (letter: string) => void;
}

export function useKeyboardHandler({
  isProcessing,
  onToggleColorMode,
  onRemoveLastReaction,
  onExit,
  onAddReaction,
}: UseKeyboardHandlerProps) {
  useInput((input, key) => {
    if (isProcessing) return;

    if (key.shift && key.tab) {
      onToggleColorMode();
    } else if (key.backspace || key.delete) {
      onRemoveLastReaction();
    } else if (key.escape || key.return) {
      onExit();
    } else if (input) {
      // Check for letters first
      if (/^[a-zA-Z]$/.test(input)) {
        onAddReaction(input);
      } // Check for special characters - handle both direct input and common variations
      else if (
        input === "@" || input === "!" || input === "?" || input === "#"
      ) {
        onAddReaction(input);
      } // Alternative mappings for easier access (optional shortcuts)
      else if (input === "1" && key.shift) {
        onAddReaction("!");
      } else if (input === "2" && key.shift) {
        onAddReaction("@");
      } else if (input === "3" && key.shift) {
        onAddReaction("#");
      } else if ((input === "/" && key.shift) || input === "?") {
        onAddReaction("?");
      } // Easy-to-type number alternatives (without shift)
      else if (input === "1") {
        onAddReaction("!");
      } else if (input === "2") {
        onAddReaction("@");
      } else if (input === "3") {
        onAddReaction("#");
      } else if (input === "0") {
        onAddReaction("?");
      }
    }
  });
}
