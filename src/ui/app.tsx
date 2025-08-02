import { useState } from "react";
import { Box, render, Text, useApp, useInput } from "ink";
import { getEmojiName, SlackApiClient } from "../lib/index.ts";
import type {
  ColorMode,
  SlackMessage,
  SlackUser,
  TypedLetter,
} from "../types/index.ts";

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
  const [colorMode, setColorMode] = useState<ColorMode>("white");
  const [typedLetters, setTypedLetters] = useState<TypedLetter[]>([]);
  const [status, setStatus] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const { exit } = useApp();

  const getDisplayName = (user: SlackUser): string => {
    return user.profile?.display_name || user.profile?.real_name ||
      user.real_name || user.name;
  };

  const getCurrentColor = (index: number): "white" | "orange" => {
    if (colorMode === "white") return "white";
    if (colorMode === "orange") return "orange";
    // Alternate mode: even indices use white, odd use orange
    return index % 2 === 0 ? "white" : "orange";
  };

  const toggleColorMode = () => {
    setColorMode((current: ColorMode) => {
      switch (current) {
        case "white":
          return "orange";
        case "orange":
          return "alternate";
        case "alternate":
          return "white";
      }
    });

    const modeLabels = {
      white: "White",
      orange: "Orange",
      alternate: "Alternating",
    };
    const newMode = colorMode === "white"
      ? "orange"
      : colorMode === "orange"
      ? "alternate"
      : "white";
    setStatus(`Switched to ${modeLabels[newMode]} mode`);
  };

  const addReaction = async (letter: string) => {
    if (isProcessing) return;

    setIsProcessing(true);
    const letterIndex = typedLetters.length;
    const color = getCurrentColor(letterIndex);
    const emojiName = getEmojiName(letter, color);

    setStatus(`Adding ${letter.toUpperCase()}...`);

    const result = await slackClient.addReaction(
      channelId,
      messageTs,
      emojiName,
    );

    if (result.ok) {
      const newLetter: TypedLetter = {
        char: letter.toUpperCase(),
        color,
        emojiName,
      };
      setTypedLetters((prev: TypedLetter[]) => [...prev, newLetter]);
      setStatus("");
    } else {
      if (result.error === "already_reacted") {
        setStatus(
          `${letter.toUpperCase()} already added. Use backspace to remove or try different color.`,
        );
      } else if (result.error === "invalid_name") {
        setStatus(
          `Emoji '${emojiName}' not found. Check if alphabet emoji pack is installed.`,
        );
      } else {
        setStatus(`Error adding ${letter.toUpperCase()}: ${result.error}`);
      }
    }

    setIsProcessing(false);
  };

  const removeLastReaction = async () => {
    if (isProcessing || typedLetters.length === 0) {
      if (typedLetters.length === 0) {
        exit();
        return;
      }
      return;
    }

    setIsProcessing(true);
    const lastLetter = typedLetters[typedLetters.length - 1];

    setStatus(`Removing ${lastLetter.char}...`);

    const result = await slackClient.removeReaction(
      channelId,
      messageTs,
      lastLetter.emojiName,
    );

    if (result.ok) {
      setTypedLetters((prev: TypedLetter[]) => prev.slice(0, -1));
      setStatus("");
    } else {
      if (result.error === "no_reaction") {
        setStatus(`Reaction ${lastLetter.char} was already removed.`);
        // Remove from local state anyway since it's not there
        setTypedLetters((prev: TypedLetter[]) => prev.slice(0, -1));
      } else {
        setStatus(`Error removing ${lastLetter.char}: ${result.error}`);
      }
    }

    setIsProcessing(false);
  };

  useInput((input, key) => {
    if (isProcessing) return;

    if (key.ctrl && input === "t") {
      toggleColorMode();
    } else if (key.backspace) {
      removeLastReaction();
    } else if (key.escape || key.return) {
      exit();
    } else if (input && /^[a-zA-Z]$/.test(input)) {
      addReaction(input);
    }
  });

  const getModeLabel = (): string => {
    const labels = {
      white: "White",
      orange: "Orange",
      alternate: "Alternating",
    };
    return labels[colorMode as keyof typeof labels];
  };

  const getLetterColor = (letter: TypedLetter): string => {
    return letter.color === "orange" ? "yellow" : "white";
  };

  return (
    <Box flexDirection="column" padding={1}>
      <Box borderStyle="round" padding={1} marginBottom={1}>
        <Text>
          <Text color="cyan" bold>{getDisplayName(author)}:</Text>{" "}
          {message.text}
        </Text>
      </Box>

      <Box marginBottom={1}>
        <Text>
          Mode: <Text bold>{getModeLabel()}</Text> | Typed:{"  "}
          {typedLetters.map((letter: TypedLetter, index: number) => (
            <Text key={index} color={getLetterColor(letter)}>
              {letter.char}
            </Text>
          ))}
        </Text>
      </Box>

      {status && (
        <Box marginBottom={1}>
          <Text color="yellow">{status}</Text>
        </Box>
      )}

      <Box>
        <Text color="gray">
          (Type letters to react, Backspace to undo, Ctrl+T to toggle color,
          Enter/Esc to exit)
        </Text>
      </Box>
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
