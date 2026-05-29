import { Pressable, Text, View } from 'react-native';
import { Note } from '../store/notesSlice';

interface NoteCardProps {
  note: Note;
  onPress: (note: Note) => void;
  onLongPress?: (note: Note) => void;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 86400000 && d.getDate() === now.getDate()) {
    return `Today at ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  if (diff < 172800000 && d.getDate() === now.getDate() - 1) {
    return `Yesterday at ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
}

function NoteCard({ note, onPress, onLongPress }: NoteCardProps) {
  return (
    <Pressable
      className="mx-4 my-1.5 rounded-card bg-surface shadow-sm"
      style={({ pressed }) => pressed && { opacity: 0.6 }}
      onPress={() => onPress(note)}
      onLongPress={() => onLongPress?.(note)}
    >
      <View className="flex-row">
        <View className="w-1 rounded-full bg-primary/30 my-3 ml-4" />
        <View className="flex-1 gap-0.5 py-3 pr-4 pl-3">
          <Text
            className="text-[15px] font-semibold leading-5 text-text-primary"
            numberOfLines={1}
          >
            {note.title || 'Untitled'}
          </Text>
          <Text
            className="text-sm leading-5 text-text-secondary"
            numberOfLines={2}
          >
            {note.content || 'No content'}
          </Text>
          <View className="flex-row items-center gap-2 mt-0.5">
            <Text className="text-xs text-text-tertiary">
              {formatDate(note.updatedAt)}
            </Text>
            {note.latitude != null && note.longitude != null && (
              <Text className="text-xs text-text-tertiary">•</Text>
            )}
            {note.latitude != null && note.longitude != null && (
              <Text className="text-xs text-text-tertiary">
                {note.latitude.toFixed(4)}, {note.longitude.toFixed(4)}
              </Text>
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export default NoteCard;
