import { Card, Group, Text } from "@mantine/core";

export default function PlanCard({ plan, onSelect }: { plan: { amount: number; validity: string; desc: string }; onSelect: (amount: number) => void }) {
    return (
        <Card
            withBorder
            padding="sm"
            radius="md"
            className="cursor-pointer hover:bg-gray-50 transition"
            onClick={() => onSelect(plan.amount)}
        >
            <Group justify="space-between">
                <Text fw={700}>₹{plan.amount}</Text>
                <Text size="sm" c="dimmed">
                    {plan.validity}
                </Text>
            </Group>

            <Text size="xs" mt={4}>
                {plan.desc}
            </Text>
        </Card>
    );
}