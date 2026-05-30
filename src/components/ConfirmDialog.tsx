import { Modal, Pressable, Text, View } from 'react-native';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel}>
      <Pressable className="flex-1 bg-black/40" onPress={onCancel}>
        <View className="justify-end flex-1">
          <Pressable className="rounded-t-2xl bg-surface px-5 pt-3 pb-6" onPress={e => e.stopPropagation()}>
            <View className="mx-auto mb-4 h-1 w-8 rounded-full bg-border" />
            <Text className="mb-1 text-lg font-semibold text-text-primary">{title}</Text>
            <Text className="mb-5 text-sm text-text-secondary">{message}</Text>
            <View className="flex-row gap-3">
              <Pressable
                className="flex-1 rounded-button border border-border py-3"
                onPress={onCancel}
              >
                <Text className="text-center text-base font-medium text-text-primary">
                  {cancelLabel}
                </Text>
              </Pressable>
              <Pressable
                className={`flex-1 rounded-button py-3 ${destructive ? 'bg-red-500' : 'bg-primary'}`}
                onPress={onConfirm}
              >
                <Text className="text-center text-base font-semibold text-white">
                  {confirmLabel}
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

export default ConfirmDialog;
