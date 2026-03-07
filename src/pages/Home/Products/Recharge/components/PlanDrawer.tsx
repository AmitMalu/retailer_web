import { Drawer, Tabs, ScrollArea, Stack } from "@mantine/core";
import PlanCard from "./PlanCard";

export default function PlanDrawer({
  opened,
  onClose,
  plans,
  setFieldValue
}: {
  opened: boolean;
  onClose: () => void;
  plans: any[];
  setFieldValue: (field: string, value: any) => void;
}) {
  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title="Mobile Plans"
      position="right"
      size="md"
    >
      <Tabs defaultValue="popular">

        <Tabs.List>
          <Tabs.Tab value="popular">Popular</Tabs.Tab>
          <Tabs.Tab value="data">Data</Tabs.Tab>
          <Tabs.Tab value="unlimited">Unlimited</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="popular" pt="sm">
          <ScrollArea h={400}>
            <Stack>
              {plans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  onSelect={(amount) => {
                    setFieldValue("amount", amount)
                    onClose()
                  }}
                />
              ))}
            </Stack>
          </ScrollArea>
        </Tabs.Panel>

      </Tabs>
    </Drawer>
  );
}