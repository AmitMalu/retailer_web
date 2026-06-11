import { Modal, Text, Stack, Progress } from "@mantine/core";
import { IconLoader, IconMapPin } from "@tabler/icons-react";

interface LocationLoadingModalProps {
  opened: boolean;
  message?: string;
}

const LocationLoadingModal = ({ opened, message = "Fetching your location..." }: LocationLoadingModalProps) => {
  return (
    <Modal
      opened={opened}
      onClose={() => {}} // Prevent closing
      withCloseButton={false}
      closeOnClickOutside={false}
      closeOnEscape={false}
      centered
      size="sm"
      p="lg"
    >
      <Stack align="center" gap="md">
        {/* Location Icon */}
        <div style={{ position: "relative" }}>
          <IconMapPin size={48} color="#3B82F6" />
          <IconLoader 
            size={20} 
            color="#3B82F6" 
            style={{ 
              position: "absolute", 
              bottom: -2, 
              right: -2,
              animation: "spin 1s linear infinite"
            }} 
          />
        </div>

        {/* Title */}
        <Text size="lg" fw={600} c="blue">
          Location Access
        </Text>

        {/* Message */}
        <Text size="sm" c="gray.6" ta="center">
          {message}
        </Text>

        {/* Progress Bar */}
        <Progress 
          value={100} 
          size="xs" 
          color="blue" 
          animated
          w={200}
        />

        {/* Additional Info */}
        <Text size="xs" c="gray.5" ta="center">
          This will only take a moment...
        </Text>
      </Stack>

      {/* Add spinning animation */}
      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </Modal>
  );
};

export default LocationLoadingModal;
