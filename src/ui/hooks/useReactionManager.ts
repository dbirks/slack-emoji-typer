import { useState, useEffect } from "react";
import { useApp } from "ink";
import { getEmojiName, type SlackApiClient } from "../../lib/index.ts";
import type { ColorMode, TypedLetter } from "../../types/index.ts";

interface UseReactionManagerProps {
  slackClient: SlackApiClient;
  channelId: string;
  messageTs: string;
  initialTypedLetters?: TypedLetter[];
}

export function useReactionManager(
  { slackClient, channelId, messageTs, initialTypedLetters = [] }: UseReactionManagerProps,
) {
  const [colorMode, setColorMode] = useState<ColorMode>("white");
  const [typedLetters, setTypedLetters] = useState<TypedLetter[]>(initialTypedLetters);
  const [status, setStatus] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const { exit } = useApp();

  // Show status message for existing letters on startup
  useEffect(() => {
    if (initialTypedLetters.length > 0) {
      const letterString = initialTypedLetters.map(l => l.char).join('');
      setStatus(`Found existing letters: ${letterString}`);
      
      // Clear the status after 3 seconds
      const timer = setTimeout(() => setStatus(""), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

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

    console.log(`🔍 DEBUG: Removing reaction - ${lastLetter.char} (${lastLetter.emojiName}) from channel ${channelId}, message ${messageTs}`);
    setStatus(`Removing ${lastLetter.char}...`);

    const result = await slackClient.removeReaction(
      channelId,
      messageTs,
      lastLetter.emojiName,
    );

    console.log(`🔍 DEBUG: Remove reaction result:`, result);

    if (result.ok) {
      setTypedLetters((prev: TypedLetter[]) => prev.slice(0, -1));
      setStatus("");
      console.log(`🔍 DEBUG: Successfully removed ${lastLetter.char}`);
    } else {
      if (result.error === "no_reaction") {
        setStatus(`Reaction ${lastLetter.char} was already removed.`);
        // Remove from local state anyway since it's not there
        setTypedLetters((prev: TypedLetter[]) => prev.slice(0, -1));
        console.log(`🔍 DEBUG: Reaction ${lastLetter.char} was already removed from Slack`);
      } else {
        setStatus(`Error removing ${lastLetter.char}: ${result.error}`);
        console.log(`🔍 DEBUG: Error removing ${lastLetter.char}:`, result.error);
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
