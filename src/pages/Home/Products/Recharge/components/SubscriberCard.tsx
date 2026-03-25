import { Card, Stack, Text, Group, Badge } from "@mantine/core";

interface Subscriber {
  name: string;
  status: string;
  balance: number;
  lastRecharge: number;
  plan: string;
}

export default function SubscriberCard({ subscriber }: { subscriber: Subscriber | null }) {
  if (!subscriber) return null;

  return (
    <Card withBorder radius="md" mt="md" padding="md">

      <Stack gap="xs">

        <Group justify="space-between">
          <Text fw={600}>{subscriber.name}</Text>
          <Badge color="green">{subscriber.status}</Badge>
        </Group>

        <Group justify="space-between">
          <Text size="sm" c="dimmed">Balance</Text>
          <Text size="sm">₹{subscriber.balance}</Text>
        </Group>

        <Group justify="space-between">
          <Text size="sm" c="dimmed">Last Recharge</Text>
          <Text size="sm">₹{subscriber.lastRecharge}</Text>
        </Group>

        <Group justify="space-between">
          <Text size="sm" c="dimmed">Plan</Text>
          <Text size="sm">{subscriber.plan}</Text>
        </Group>

      </Stack>

    </Card>
  );
}