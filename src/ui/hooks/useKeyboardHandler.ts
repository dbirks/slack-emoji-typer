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

    // Handle special keys first, regardless of input value
    if (key.shift && key.tab) {
      onToggleColorMode();
      return;
    }

    // Handle backspace (can be detected as either backspace or delete depending on terminal)
    if (key.backspace || key.delete) {
      onRemoveLastReaction();
      return;
    }

    if (key.escape) {
      onExit();
      return;
    }

    // Handle regular character input only if no special keys were pressed
    if (input && !key.backspace && !key.escape && !(key.shift && key.tab)) {
      // Check for letters and symbols
      if (/^[a-zA-Z@!?#]$/.test(input)) {
        onAddReaction(input);
      }
    }
  });
}
