import { Pressable, Text, View } from 'react-native';
import { Note } from '../store/notesSlice';

interface NoteCardProps {
  note: Note;
  onPress: (note: Note) => void;
  onLongPress?: (note: Note) => void;
}

function NoteCard({ note, onPress, onLongPress }: NoteCardProps) {
  return (
    <Pressable
      className="mx-4 my-1.5 rounded-card bg-surface p-4 shadow-sm"
      style={({ pressed }) => pressed && { opacity: 0.7 }}
      onPress={() => onPress(note)}
      onLongPress={() => onLongPress?.(note)}
    >
      <View className="gap-1">
        <Text
          className="text-lg font-semibold text-text-primary"
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
        <Text className="mt-1 text-xs text-text-tertiary">
          {new Date(note.updatedAt).toLocaleDateString()}
        </Text>
        {note.latitude && note.longitude && (
          <Text className="mt-1 text-xs text-text-tertiary">
            📍 {note.latitude.toFixed(4)}, {note.longitude.toFixed(4)}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

export default NoteCard;
