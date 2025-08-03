import { Box, Text } from "ink";
import type { ColorMode, TypedLetter } from "../../types/index.ts";

interface InputBoxProps {
  colorMode: ColorMode;
  typedLetters: TypedLetter[];
}

export function InputBox({ colorMode, typedLetters }: InputBoxProps) {
  const getModeLabel = (): string => {
    const labels = {
      white: "white",
      orange: "orange", 
      alternate: "alternating",
    };
    return labels[colorMode as keyof typeof labels];
  };

  const getLetterColor = (letter: TypedLetter): string => {
    return letter.color === "orange" ? "yellow" : "white";
  };

  return (
    <Box flexDirection="column" marginBottom={1}>
      {/* Input box with border */}
      <Box borderStyle="single" paddingX={1}>
        <Text color="green">&gt; </Text>
        {typedLetters.map((letter: TypedLetter, index: number) => (
          <Text key={index} color={getLetterColor(letter)}>
            {letter.char}
          </Text>
        ))}
      </Box>
      
      {/* Mode status underneath */}
      <Box marginTop={0}>
        <Text color="gray" dimColor>
          ⏵⏵ {getModeLabel()} mode (shift+tab to cycle)
        </Text>
      </Box>
    </Box>
  );
}