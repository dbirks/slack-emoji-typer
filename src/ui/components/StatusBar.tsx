import { Box, Text } from "ink";
import type { ColorMode, TypedLetter } from "../../types/index.ts";

interface StatusBarProps {
  colorMode: ColorMode;
  typedLetters: TypedLetter[];
}

export function StatusBar({ colorMode, typedLetters }: StatusBarProps) {
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
    <Box marginBottom={1}>
      <Text>
        Mode: <Text bold>{getModeLabel()}</Text> | Typed:{" "}
        {typedLetters.map((letter: TypedLetter, index: number) => (
          <Text key={index} color={getLetterColor(letter)}>
            {letter.char}
          </Text>
        ))}
      </Text>
    </Box>
  );
}
