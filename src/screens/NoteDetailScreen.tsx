import { useCallback, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
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
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg text-text-tertiary">Note not found</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        keyboardShouldPersistTaps="handled">
        <TextInput
          className="border-b border-border pb-3 mb-4 text-2xl font-bold text-text-primary"
          value={title}
          onChangeText={handleChangeTitle}
          placeholder="Note title"
          placeholderTextColor="#999"
        />
        <TextInput
          className="min-h-[200px] py-3 text-base leading-6 text-text-primary"
          value={content}
          onChangeText={handleChangeContent}
          placeholder="Note content"
          placeholderTextColor="#999"
          multiline
          textAlignVertical="top"
        />
        <Text className="mt-4 mb-6 text-xs text-text-tertiary">
          Created: {new Date(note.createdAt).toLocaleString()} • Updated:{' '}
          {new Date(note.updatedAt).toLocaleString()}
        </Text>

        <View className="gap-3">
          <Pressable
            className={`rounded-button py-3.5 ${dirty ? 'bg-primary' : 'bg-blue-200'}`}
            onPress={handleSave}
            disabled={!dirty}>
            <Text className="text-center text-base font-semibold text-white">
              Save Changes
            </Text>
          </Pressable>
          <Pressable
            className="rounded-button border border-danger py-3.5"
            onPress={handleDelete}>
            <Text className="text-center text-base font-semibold text-danger">
              Delete Note
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default NoteDetailScreen;
