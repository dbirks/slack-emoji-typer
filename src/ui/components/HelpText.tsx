import { Box, Text } from "ink";

export function HelpText() {
  return (
    <Box>
      <Text color="white" dimColor>
        Type letters (A-Z) or symbols (@!?#) to attach emojis, Backspace/Delete
        to undo, Esc to exit
      </Text>
    </Box>
  );
}
