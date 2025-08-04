import { useState } from "react";
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
  { slackClient, channelId, messageTs, initialTypedLetters = [] }:
    UseReactionManagerProps,
) {
  const [colorMode, setColorMode] = useState<ColorMode>("white");
  const [typedLetters, setTypedLetters] = useState<TypedLetter[]>(
    initialTypedLetters,
  );
  const [status, setStatus] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const { exit } = useApp();

  const getCurrentColor = (_index: number): "white" | "orange" => {
    return colorMode;
  };

  const toggleColorMode = () => {
    setColorMode((current: ColorMode) => {
      return current === "white" ? "orange" : "white";
    });
  };

  const addReaction = async (letter: string) => {
    if (isProcessing) return;

    setIsProcessing(true);
    const letterIndex = typedLetters.length;
    const color = getCurrentColor(letterIndex);
    const emojiName = getEmojiName(letter, color);

    // Add letter immediately as pending
    const pendingLetter: TypedLetter = {
      char: letter.toUpperCase(),
      color,
      emojiName,
      pending: true,
    };
    setTypedLetters((prev: TypedLetter[]) => [...prev, pendingLetter]);

    const result = await slackClient.addReaction(
      channelId,
      messageTs,
      emojiName,
    );

    if (result.ok) {
      // Update the letter to confirmed (remove pending state)
      setTypedLetters((prev: TypedLetter[]) =>
        prev.map((letter, index) =>
          index === prev.length - 1 ? { ...letter, pending: false } : letter
        )
      );
      setStatus("");
    } else {
      // Remove the pending letter and show error
      setTypedLetters((prev: TypedLetter[]) => prev.slice(0, -1));

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
      return;
    }

    setIsProcessing(true);
    const lastLetter = typedLetters[typedLetters.length - 1];

    // Mark the last letter as removing immediately
    setTypedLetters((prev: TypedLetter[]) =>
      prev.map((letter, index) =>
        index === prev.length - 1 ? { ...letter, removing: true } : letter
      )
    );

    const result = await slackClient.removeReaction(
      channelId,
      messageTs,
      lastLetter.emojiName,
    );

    if (result.ok) {
      // Remove the letter from UI after API confirms
      setTypedLetters((prev: TypedLetter[]) => prev.slice(0, -1));
      setStatus("");
    } else {
      if (result.error === "no_reaction") {
        setStatus(`Reaction ${lastLetter.char} was already removed.`);
        // Remove from local state anyway since it's not there
        setTypedLetters((prev: TypedLetter[]) => prev.slice(0, -1));
      } else {
        // Restore the letter (remove removing state) if error occurred
        setTypedLetters((prev: TypedLetter[]) =>
          prev.map((letter, index) =>
            index === prev.length - 1 ? { ...letter, removing: false } : letter
          )
        );
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
