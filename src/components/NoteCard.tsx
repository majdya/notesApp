import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Note } from '../types/note';

interface NoteCardProps {
  note: Note;
  onPress: (note: Note) => void;
  onLongPress?: (note: Note) => void;
}

function NoteCard({ note, onPress, onLongPress }: NoteCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={() => onPress(note)}
      onLongPress={() => onLongPress?.(note)}>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {note.title || 'Untitled'}
        </Text>
        <Text style={styles.preview} numberOfLines={2}>
          {note.content || 'No content'}
        </Text>
        <Text style={styles.date}>
          {new Date(note.updatedAt).toLocaleDateString()}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  pressed: {
    opacity: 0.7,
  },
  content: {
    gap: 4,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  preview: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  date: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
});

export default NoteCard;
