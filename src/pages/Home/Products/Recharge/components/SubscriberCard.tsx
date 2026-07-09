import { Card, Stack, Text, Group, Badge, Divider } from "@mantine/core";

export interface Subscriber {
  name: string | null;
  status: string | null;
  balance: string | null;
  lastRechargeAmount: string | null;
  lastRechargeDate: string | null;
  monthlyRecharge: string | null;
  planName: string | null;
  nextRechargeDate: string | null;
}

const dash = (val: string | null | undefined) =>
  val && val.trim() && val.trim() !== "," ? val.trim() : "-";

const dashAmount = (val: string | null | undefined) =>
  val && val.trim() && val.trim() !== "," ? val.trim() : "0";

export default function SubscriberCard({ subscriber }: { subscriber: Subscriber | null }) {
  if (!subscriber) return null;

  const isActive = subscriber.status?.toLowerCase() === "active";

  const rows: { label: string; value: string | null; isAmount?: boolean }[] = [
    { label: "Balance", value: subscriber.balance ? `₹${subscriber.balance}` : null, isAmount: true },
    { label: "Monthly Recharge", value: subscriber.monthlyRecharge ? `₹${subscriber.monthlyRecharge}` : null, isAmount: true },
    { label: "Plan Name", value: subscriber.planName },
    { label: "Last Recharge Amount", value: subscriber.lastRechargeAmount ? `₹${subscriber.lastRechargeAmount}` : null, isAmount: true },
    { label: "Last Recharge Date", value: subscriber.lastRechargeDate },
    { label: "Next Recharge Date", value: subscriber.nextRechargeDate },
  ];

  return (
    <Card withBorder radius="md" mt="md" p="md">
      <Stack gap="xs">

        {/* Name + Status */}
        <Group justify="space-between" align="center">
          <Text fw={600} size="sm">{dash(subscriber.name)}</Text>
          <Badge color={isActive ? "green" : "red"} variant="light">
            {dash(subscriber.status)}
          </Badge>
        </Group>

        <Divider />

        {/* All other rows */}
        {rows.map(({ label, value, isAmount }) => (
          <Group key={label} justify="space-between">
            <Text size="sm" c="dimmed">{label}</Text>
            <Text size="sm" fw={500}>{isAmount ? dashAmount(value) : dash(value)}</Text>
          </Group>
        ))}

      </Stack>
    </Card>
  );
}
