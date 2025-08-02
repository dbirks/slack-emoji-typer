import { Box, Text } from "ink";

interface StatusMessageProps {
  message: string;
}

export function StatusMessage({ message }: StatusMessageProps) {
  if (!message) return null;

  return (
    <Box marginBottom={1}>
      <Text color="yellow">{message}</Text>
    </Box>
  );
}
