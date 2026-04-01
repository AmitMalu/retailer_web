import { Drawer, Tabs, ScrollArea, Stack } from "@mantine/core";
import PlanCard from "./PlanCard";

export default function PlanDrawer({
  opened,
  onClose,
  plans,
  planTypes,
  setFieldValue
}: {
  opened: boolean;
  onClose: () => void;
  plans: any[];
  planTypes: string[];
  setFieldValue: (field: string, value: any) => void;
}) {

  const getPlansByType = (type: string) =>
    plans?.filter((p) => p.type === type);

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title="Mobile Plans"
      position="right"
      size="md"
    >
      <Tabs defaultValue={planTypes?.[0] || ""}>

        {/* Dynamic Tabs */}
        <Tabs.List>
          {planTypes.map((type) => (
            <Tabs.Tab key={type} value={type}>
              {type}
            </Tabs.Tab>
          ))}
        </Tabs.List>

        {/* Dynamic Panels */}
        {planTypes.map((type) => (
          <Tabs.Panel key={type} value={type} pt="sm">
            <ScrollArea h={400}>
              <Stack>
                {getPlansByType(type)?.map((plan) => (
                  <PlanCard
                    key={plan.amount + plan.desc}
                    plan={plan}
                    onSelect={(amount) => {
                      setFieldValue("amount", amount);
                      onClose();
                    }}
                  />
                ))}
              </Stack>
            </ScrollArea>
          </Tabs.Panel>
        ))}

      </Tabs>
    </Drawer>
  );
}