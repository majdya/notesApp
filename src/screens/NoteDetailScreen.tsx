import { useCallback, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateNote, deleteNote } from '../store/notesSlice';

type Props = NativeStackScreenProps<RootStackParamList, 'NoteDetail'>;

function NoteDetailScreen({ route, navigation }: Props) {
  const { noteId } = route.params;
  const note = useAppSelector(state =>
    state.notes.notes.find(n => n.id === noteId),
  );
  const dispatch = useAppDispatch();

  const [title, setTitle] = useState(note?.title ?? '');
  const [content, setContent] = useState(note?.content ?? '');
  const [dirty, setDirty] = useState(false);

  const handleSave = useCallback(() => {
    if (!title.trim() && !content.trim()) {
      Alert.alert('Empty note', 'Add a title or content to your note.');
      return;
    }
    dispatch(
      updateNote({
        id: noteId,
        title: title.trim() || 'Untitled',
        content: content.trim(),
      }),
    );
    setDirty(false);
    navigation.goBack();
  }, [dispatch, noteId, title, content, navigation]);

  const handleDelete = useCallback(() => {
    Alert.alert('Delete note', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          dispatch(deleteNote(noteId));
          navigation.goBack();
        },
      },
    ]);
  }, [dispatch, noteId, navigation]);

  const handleChangeTitle = useCallback((text: string) => {
    setTitle(text);
    setDirty(true);
  }, []);

  const handleChangeContent = useCallback((text: string) => {
    setContent(text);
    setDirty(true);
  }, []);

  if (!note) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Note not found</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled">
      <TextInput
        style={styles.titleInput}
        value={title}
        onChangeText={handleChangeTitle}
        placeholder="Note title"
        placeholderTextColor="#999"
      />
      <TextInput
        style={styles.contentInput}
        value={content}
        onChangeText={handleChangeContent}
        placeholder="Note content"
        placeholderTextColor="#999"
        multiline
        textAlignVertical="top"
      />
      <Text style={styles.meta}>
        Created: {new Date(note.createdAt).toLocaleString()} • Updated:{' '}
        {new Date(note.updatedAt).toLocaleString()}
      </Text>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.btn, !dirty && styles.btnDisabled]}
          onPress={handleSave}
          disabled={!dirty}>
          <Text style={[styles.btnText, !dirty && styles.btnTextDisabled]}>
            Save Changes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
          <Text style={styles.deleteText}>Delete Note</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#999',
  },
  titleInput: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 16,
  },
  contentInput: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    minHeight: 200,
    paddingVertical: 12,
  },
  meta: {
    fontSize: 12,
    color: '#999',
    marginTop: 16,
    marginBottom: 24,
  },
  actions: {
    gap: 12,
  },
  btn: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnDisabled: {
    backgroundColor: '#cce4ff',
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  btnTextDisabled: {
    color: '#fff',
  },
  deleteBtn: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ff4444',
  },
  deleteText: {
    color: '#ff4444',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default NoteDetailScreen;
