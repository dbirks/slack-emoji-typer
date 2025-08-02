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

  return (
    <Box borderStyle="round" padding={1} marginBottom={1}>
      <Text>
        <Text color="cyan" bold>{getDisplayName(author)}:</Text> {message.text}
      </Text>
    </Box>
  );
}
