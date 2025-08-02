import { useState } from "react";
import { useApp } from "ink";
import { getEmojiName, SlackApiClient } from "../../lib/index.ts";
import type { ColorMode, TypedLetter } from "../../types/index.ts";

interface UseReactionManagerProps {
  slackClient: SlackApiClient;
  channelId: string;
  messageTs: string;
}

export function useReactionManager(
  { slackClient, channelId, messageTs }: UseReactionManagerProps,
) {
  const [colorMode, setColorMode] = useState<ColorMode>("white");
  const [typedLetters, setTypedLetters] = useState<TypedLetter[]>([]);
  const [status, setStatus] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const { exit } = useApp();

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

  return {
    colorMode,
    typedLetters,
    status,
    isProcessing,
    toggleColorMode,
    addReaction,
    removeLastReaction,
    exit,
  };
}
