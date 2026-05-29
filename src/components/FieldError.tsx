import { Text, View } from 'react-native';

interface FieldErrorProps {
  error?: string | null;
}

function FieldError({ error }: FieldErrorProps) {
  if (!error) return null;

  return (
    <View className="mb-2">
      <Text className="text-xs text-danger">{error}</Text>
    </View>
  );
}

export default FieldError;
