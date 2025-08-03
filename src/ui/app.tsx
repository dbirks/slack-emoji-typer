import { Box, render } from "ink";
import { parseExistingAlphabetReactions, type SlackApiClient } from "../lib/index.ts";
import type { SlackMessage, SlackUser } from "../types/index.ts";
import {
  HelpText,
  MessageDisplay,
  StatusBar,
  StatusMessage,
} from "./components/index.ts";
import { useKeyboardHandler, useReactionManager } from "./hooks/index.ts";

interface AppProps {
  slackClient: SlackApiClient;
  channelId: string;
  messageTs: string;
  message: SlackMessage;
  author: SlackUser;
}

export function App(
  { slackClient, channelId, messageTs, message, author }: AppProps,
) {
  // Parse existing alphabet emoji reactions from the message
  const initialTypedLetters = message.reactions
    ? parseExistingAlphabetReactions(message.reactions)
    : [];

  const {
    colorMode,
    typedLetters,
    status,
    isProcessing,
    toggleColorMode,
    addReaction,
    removeLastReaction,
    exit,
  } = useReactionManager({ 
    slackClient, 
    channelId, 
    messageTs, 
    initialTypedLetters 
  });

  useKeyboardHandler({
    isProcessing,
    onToggleColorMode: toggleColorMode,
    onRemoveLastReaction: removeLastReaction,
    onExit: exit,
    onAddReaction: addReaction,
  });

  return (
    <Box flexDirection="column" padding={1}>
      <MessageDisplay message={message} author={author} />
      <StatusBar colorMode={colorMode} typedLetters={typedLetters} />
      <StatusMessage message={status} />
      <HelpText />
    </Box>
  );
}

export async function renderApp(
  slackClient: SlackApiClient,
  channelId: string,
  messageTs: string,
  message: SlackMessage,
  author: SlackUser,
) {
  const { waitUntilExit } = render(
    <App
      slackClient={slackClient}
      channelId={channelId}
      messageTs={messageTs}
      message={message}
      author={author}
    />,
  );

  await waitUntilExit();
}
