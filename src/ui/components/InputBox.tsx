import { Box, Text } from "ink";
import type { ColorMode, TypedLetter } from "../../types/index.ts";

interface InputBoxProps {
  colorMode: ColorMode;
  typedLetters: TypedLetter[];
}

export function InputBox({ colorMode, typedLetters }: InputBoxProps) {
  const getModeLabel = (): string => {
    return colorMode;
  };

  const getBorderColor = (): string => {
    return colorMode === "white" ? "white" : "#FF8800";
  };

  const getPromptColor = (): string => {
    return colorMode === "white" ? "white" : "#FF8800";
  };

  const getLetterColor = (letter: TypedLetter): string => {
    if (letter.pending || letter.removing) {
      // Dimmed colors for pending/removing letters
      return letter.color === "orange" ? "#CC6600" : "gray";
    }
    // Normal colors for confirmed letters
    return letter.color === "orange" ? "#FF8800" : "white";
  };

  return (
    <Box flexDirection="column" marginBottom={1}>
      {/* Input box with border */}
      <Box borderStyle="bold" borderColor={getBorderColor()} paddingX={1}>
        <Text color={getPromptColor()}>{"> "}</Text>
        {typedLetters.map((letter: TypedLetter, index: number) => (
          <Text key={index} color={getLetterColor(letter)} bold>
            {letter.char}
          </Text>
        ))}
      </Box>

      {/* Mode status underneath */}
      <Box marginTop={0}>
        <Text color="gray" dimColor>
          ⏵⏵ {getModeLabel()} mode <Text dimColor>(shift+tab to cycle)</Text>
        </Text>
      </Box>
    </Box>
  );
}
