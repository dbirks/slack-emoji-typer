import { Box, Text } from "ink";
import type { SlackMessage, SlackUser } from "../../types/index.ts";

interface MessageDisplayProps {
  message: SlackMessage;
  author: SlackUser;
}

export function MessageDisplay({ message, author }: MessageDisplayProps) {
  const getDisplayName = (user: SlackUser): string => {
    // Priority order: display_name > profile.real_name > real_name > first+last > name (username/id)
    if (user.profile?.display_name) {
      return user.profile.display_name;
    }
    if (user.profile?.real_name) {
      return user.profile.real_name;
    }
    if (user.real_name) {
      return user.real_name;
    }
    if (user.profile?.first_name || user.profile?.last_name) {
      const firstName = user.profile.first_name || "";
      const lastName = user.profile.last_name || "";
      return `${firstName} ${lastName}`.trim();
    }
    return user.name; // fallback to username/id
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
    <Box
      borderStyle="round"
      borderColor="gray"
      paddingX={3}
      paddingY={1}
      marginBottom={1}
    >
      <Box flexDirection="column">
        <Box>
          <Text color="cyan" bold>{getDisplayName(author)}</Text>
          <Text color="gray">{`  ${formatTime(message.ts)}`}</Text>
        </Box>
        <Box marginTop={1}>
          <Text>{message.text}</Text>
        </Box>
      </Box>
    </Box>
  );
}
