import { Box, Text } from "ink";
import type { SlackMessage, SlackUser } from "../../types/index.ts";

interface MessageDisplayProps {
  message: SlackMessage;
  author: SlackUser;
}

export function MessageDisplay({ message, author }: MessageDisplayProps) {
  const getDisplayName = (user: SlackUser): string => {
    return user.profile?.display_name || user.profile?.real_name ||
      user.real_name || user.name;
  };

  const formatTime = (timestamp: string): string => {
    // Convert Slack timestamp (seconds.microseconds) to Date
    const date = new Date(parseFloat(timestamp) * 1000);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <Box borderStyle="round" paddingX={3} paddingY={1} marginBottom={1}>
      <Box flexDirection="column">
        <Box>
          <Text color="cyan" bold>{getDisplayName(author)}</Text>
          <Text color="gray" dimColor>{formatTime(message.ts)}</Text>
        </Box>
        <Box marginTop={1}>
          <Text>{message.text}</Text>
        </Box>
      </Box>
    </Box>
  );
}
