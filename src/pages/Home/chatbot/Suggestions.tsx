import { Button, Stack } from "@mantine/core";
import type { BotOption } from "@/Config/botConfig";

type SuggestionsProps = {
  suggestions: BotOption[];
  onSelect: (suggestion: BotOption) => void;
};

export default function Suggestions({ suggestions, onSelect }: SuggestionsProps) {
  if (!suggestions.length) return null;

  return (
    <Stack gap={4}>
      {suggestions.map((suggestion) => (
        <Button
          key={suggestion.path}
          size="xs"
          variant="light"
          onClick={() => onSelect(suggestion)}
        >
          {suggestion.label}
        </Button>
      ))}
    </Stack>
  );
}
