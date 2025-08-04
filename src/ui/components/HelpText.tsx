import { Box, Text } from "ink";

export function HelpText() {
  return (
    <Box>
      <Text color="gray">
        (Type letters (A-Z) or numbers (1=! 2=@ 3=# 0=?) to react, Backspace/Delete to undo, Enter/Esc to exit)
      </Text>
    </Box>
  );
}
