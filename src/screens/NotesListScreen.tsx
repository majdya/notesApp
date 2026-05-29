import { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import uuid from 'react-native-uuid';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addNote, deleteNote } from '../store/notesSlice';
import NoteCard from '../components/NoteCard';
import { Note } from '../types/note';
import { RootStackParamList } from '../navigation/AppNavigator';

type NotesListNavProp = NativeStackNavigationProp<RootStackParamList, 'NotesList'>;

interface Props {
  navigation: NotesListNavProp;
}

function NotesListScreen({ navigation }: Props) {
  const { notes } = useAppSelector(state => state.notes);
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleCreate = useCallback(() => {
    if (!title.trim() && !content.trim()) {
      Alert.alert('Empty note', 'Add a title or content to your note.');
      return;
    }
    const now = new Date().toISOString();
    dispatch(
      addNote({
        id: uuid.v4().toString(),
        title: title.trim() || 'Untitled',
        content: content.trim(),
        createdAt: now,
        updatedAt: now,
      }),
    );
    setTitle('');
    setContent('');
    setShowForm(false);
  }, [title, content, dispatch]);

  const handleDelete = useCallback(
    (note: Note) => {
      Alert.alert('Delete note', 'Are you sure?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => dispatch(deleteNote(note.id)),
        },
      ]);
    },
    [dispatch],
  );

  const handlePress = useCallback(
    (note: Note) => {
      navigation.navigate('NoteDetail', { noteId: note.id });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: Note }) => (
      <NoteCard
        note={item}
        onPress={handlePress}
        onLongPress={handleDelete}
      />
    ),
    [handlePress, handleDelete],
  );

  const renderEmpty = useCallback(
    () => (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>No notes yet</Text>
        <Text style={styles.emptySubtitle}>Tap the + button to create one</Text>
      </View>
    ),
    [],
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {showForm && (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Note title"
            placeholderTextColor="#999"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={[styles.input, styles.contentInput]}
            placeholder="Note content"
            placeholderTextColor="#999"
            value={content}
            onChangeText={setContent}
            multiline
          />
          <View style={styles.formActions}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => {
                setTitle('');
                setContent('');
                setShowForm(false);
              }}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleCreate}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <FlatList
        data={notes}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={notes.length === 0 ? styles.emptyList : styles.list}
      />

      {!showForm && (
        <TouchableOpacity
          style={[styles.fab, { bottom: insets.bottom + 24 }]}
          onPress={() => setShowForm(true)}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  form: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#1a1a1a',
    marginBottom: 8,
  },
  contentInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 4,
  },
  cancelBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  cancelText: {
    fontSize: 15,
    color: '#666',
  },
  saveBtn: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  saveText: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '600',
  },
  list: {
    paddingVertical: 8,
  },
  emptyList: {
    flex: 1,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#999',
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#bbb',
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  fabText: {
    fontSize: 28,
    color: '#fff',
    lineHeight: 30,
  },
});

export default NotesListScreen;
