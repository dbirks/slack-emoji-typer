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
      // Check for letters and symbols
      if (/^[a-zA-Z@!?#]$/.test(input)) {
        onAddReaction(input);
      }
    }
  });
}
