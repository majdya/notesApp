import { useCallback, useEffect, useState, useRef } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateNote, deleteNote } from '../store/notesSlice';
import FieldError from '../components/FieldError';
import { validateNoteTitle, validateNoteContent } from '../utils/validations';

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
  const [isSaving, setIsSaving] = useState(false);
  const [titleError, setTitleError] = useState<string | null>(null);
  const isSavingRef = useRef(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      if (!dirty || isSavingRef.current) return;
      e.preventDefault();
      Alert.alert(
        'Unsaved changes',
        'You have unsaved changes. Discard them?',
        [
          { text: 'Keep editing', style: 'cancel' },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => navigation.dispatch(e.data.action),
          },
        ],
      );
    });
    return unsubscribe;
  }, [navigation, dirty]);

  const handleSave = useCallback(async () => {
    const titleErr = validateNoteTitle(title);
    setTitleError(titleErr);
    if (titleErr) return;

    isSavingRef.current = true;
    dispatch(
      updateNote({
        id: noteId,
        title: title.trim(),
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
    setTitleError(validateNoteTitle(text));
  }, []);

  const handleChangeContent = useCallback((text: string) => {
    setContent(text);
    setDirty(true);
  }, []);

  if (!note) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Text className="mb-2 text-lg text-text-tertiary">Note not found</Text>
        <Pressable
          className="rounded-button bg-primary px-6 py-3"
          onPress={() => navigation.goBack()}
        >
          <Text className="text-base font-semibold text-white">Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-background"
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        keyboardShouldPersistTaps="handled"
      >
        <TextInput
          className="border-b border-border pb-3 mb-1 text-2xl font-bold text-text-primary"
          value={title}
          onChangeText={handleChangeTitle}
          placeholder="Note title"
          placeholderTextColor="#999"
          editable={!isSaving}
        />
        <FieldError error={titleError} />
        <TextInput
          className="min-h-[200px] py-3 text-base leading-6 text-text-primary"
          value={content}
          onChangeText={handleChangeContent}
          placeholder="Note content"
          placeholderTextColor="#999"
          multiline
          textAlignVertical="top"
          editable={!isSaving}
        />
        <Text className="mt-4 mb-6 text-xs text-text-tertiary">
          Created: {new Date(note.createdAt).toLocaleString()} • Updated:{' '}
          {new Date(note.updatedAt).toLocaleString()}
        </Text>
        {note.latitude != null && note.longitude != null && (
          <Text className="mb-6 text-xs text-text-tertiary">
            Location: {note.latitude.toFixed(4)}, {note.longitude.toFixed(4)}
          </Text>
        )}
        <View className="gap-3">
          <Pressable
            className={`rounded-button py-3.5 
              ${
                dirty && !titleError && title.trim() && !isSaving
                  ? 'bg-primary'
                  : 'bg-blue-200'
              }`}
            onPress={handleSave}
            disabled={!dirty || !!titleError || !title.trim() || isSaving}
          >
            {isSaving ? (
              <View className="flex-row items-center justify-center gap-2">
                <ActivityIndicator color="#fff" size="small" />
                <Text className="text-base font-semibold text-white">
                  Saving...
                </Text>
              </View>
            ) : (
              <Text className="text-center text-base font-semibold text-white">
                Save Changes
              </Text>
            )}
          </Pressable>
          <Pressable
            className="rounded-button border border-danger py-3.5"
            onPress={handleDelete}
            disabled={isSaving}
          >
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
