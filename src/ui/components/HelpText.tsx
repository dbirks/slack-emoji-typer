import { Box, Text } from "ink";

export function HelpText() {
  return (
    <Box>
      <Text color="gray">
        (Type letters to react, Backspace to undo, Ctrl+T to toggle color,
        Enter/Esc to exit)
      </Text>
    </Box>
  );
}
