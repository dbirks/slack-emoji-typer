import { Box, Text } from "ink";
import type { SlackMessage, SlackUser } from "../../types/index.ts";

interface MessageDisplayProps {
  message: SlackMessage & { userColors?: Map<string, string> };
  author: SlackUser;
}

export function MessageDisplay({ message, author }: MessageDisplayProps) {
  const getDisplayName = (user: SlackUser): string => {
    // Priority order: real_name > profile.real_name > first+last > display_name > name (username/id)
    if (user.real_name) {
      return user.real_name;
    }
    if (user.profile?.real_name) {
      return user.profile.real_name;
    }
    if (user.profile?.first_name || user.profile?.last_name) {
      const firstName = user.profile.first_name || "";
      const lastName = user.profile.last_name || "";
      return `${firstName} ${lastName}`.trim();
    }
    if (user.profile?.display_name) {
      return user.profile.display_name;
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

  const renderMessageWithStyledMentions = (
    text: string,
    userColors?: Map<string, string>,
  ) => {
    if (!userColors || userColors.size === 0) {
      return <Text>{text}</Text>;
    }

    // Split by exact resolved usernames from the API
    let result = text;
    const parts: Array<{ text: string; color?: string }> = [];

    for (const [mention, color] of userColors.entries()) {
      const regex = new RegExp(
        `(${mention.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
        "g",
      );
      result = result.replace(regex, `|||${mention}|||`);
    }

    const splitParts = result.split("|||");
    for (let i = 0; i < splitParts.length; i++) {
      const part = splitParts[i];
      if (userColors.has(part)) {
        parts.push({ text: part, color: userColors.get(part) });
      } else if (part !== "") {
        parts.push({ text: part });
      }
    }

    return (
      <Text>
        {parts.map((part, index) => {
          if (part.color) {
            return (
              <Text key={index} color={part.color}>
                {part.text}
              </Text>
            );
          }
          return part.text;
        })}
      </Text>
    );
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
          <Text color="whiteBright" bold>{getDisplayName(author)}</Text>
          <Text color="gray">{`  ${formatTime(message.ts)}`}</Text>
        </Box>
        <Box marginTop={1}>
          {renderMessageWithStyledMentions(message.text, message.userColors)}
        </Box>
      </Box>
    </Box>
  );
}
