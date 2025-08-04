import { Box, Text } from "ink";

export function HelpText() {
  return (
    <Box>
      <Text color="gray">
        (Type letters/symbols (@!?#) to react, Backspace/Delete to undo, Enter/Esc to exit)
      </Text>
    </Box>
  );
}
