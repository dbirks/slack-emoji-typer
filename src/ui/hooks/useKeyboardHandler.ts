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

    // Debug logging to see what we're receiving
    console.log(`Debug - input: "${input}", key:`, key);

    if (key.shift && key.tab) {
      onToggleColorMode();
    } else if (key.backspace || key.delete) {
      onRemoveLastReaction();
    } else if (key.escape || key.return) {
      onExit();
    } else if (input && /^[a-zA-Z@!?#]$/.test(input)) {
      onAddReaction(input);
    } else if (key.shift) {
      // Handle shift-based special characters that might not come through as input
      let specialChar = '';
      if (key.shift && input === '2') specialChar = '@';
      else if (key.shift && input === '1') specialChar = '!';
      else if (key.shift && input === '/') specialChar = '?';
      else if (key.shift && input === '3') specialChar = '#';
      
      if (specialChar) {
        onAddReaction(specialChar);
      }
    }
  });
}
