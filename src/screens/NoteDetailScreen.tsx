import { useEffect, useState, useRef } from 'react';
import {
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
import ConfirmDialog from '../components/ConfirmDialog';
import FieldError from '../components/FieldError';
import { validateNoteTitle } from '../utils/validations';

type Props = NativeStackScreenProps<RootStackParamList, 'NoteDetail'>;

const KEYBOARD_BEHAVIOR: 'padding' | undefined = Platform.OS === 'ios' ? 'padding' : undefined;

function NoteDetailScreen({ route, navigation }: Props) {
  const { noteId } = route.params;
  const note = useAppSelector(state =>
    state.notes.notes.find(n => n.id === noteId),
  );
  const dispatch = useAppDispatch();

  const [title, setTitle] = useState(note?.title ?? '');
  const [content, setContent] = useState(note?.content ?? '');
  const [dirty, setDirty] = useState(false);
  const [titleError, setTitleError] = useState<string | null>(null);
  const isSavingRef = useRef(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const pendingActionRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      if (!dirty || isSavingRef.current) return;
      e.preventDefault();
      pendingActionRef.current = () => navigation.dispatch(e.data.action);
      setShowUnsavedDialog(true);
    });
    return unsubscribe;
  }, [navigation, dirty]);

  const handleSave = () => {
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
  };

  function handleDelete() {
    setShowDeleteDialog(true);
  }

  function handleChangeTitle(text: string) {
    setTitle(text);
    setDirty(true);
    setTitleError(validateNoteTitle(text));
  }

  function handleChangeContent(text: string) {
    setContent(text);
    setDirty(true);
  }

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
      behavior={KEYBOARD_BEHAVIOR}
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
          placeholderTextColor="#aeaeb2"
        />
        <FieldError error={titleError} />
        <TextInput
          className="min-h-[200px] py-3 text-base leading-6 text-text-primary"
          value={content}
          onChangeText={handleChangeContent}
          placeholder="Note content"
          placeholderTextColor="#aeaeb2"
          multiline
          textAlignVertical="top"
        />
        <View className="mb-6 flex-row flex-wrap gap-x-4 gap-y-1">
          <Text className="text-xs text-text-tertiary">
            Created {new Date(note.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
          </Text>
          <Text className="text-xs text-text-tertiary">
            Updated {new Date(note.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
          </Text>
          {note.latitude != null && note.longitude != null && (
            <Text className="text-xs text-text-tertiary">
              {note.latitude.toFixed(4)}, {note.longitude.toFixed(4)}
            </Text>
          )}
        </View>
        <View className="gap-2.5">
          <Pressable
            className={`rounded-button py-3.5 ${
              dirty && !titleError && title.trim()
                ? 'bg-primary'
                : 'bg-primary/20'
            }`}
            onPress={handleSave}
            disabled={!dirty || !!titleError || !title.trim()}
          >
            <Text className="text-center text-base font-semibold text-white">
              Save Changes
            </Text>
          </Pressable>
          <Pressable
            className="rounded-button border border-danger/30 py-3.5"
            onPress={handleDelete}
          >
            <Text className="text-center text-base font-semibold text-danger">
              Delete Note
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      <ConfirmDialog
        visible={showUnsavedDialog}
        title="Unsaved changes"
        message="You have unsaved changes. Discard them?"
        confirmLabel="Discard"
        cancelLabel="Keep editing"
        destructive
        onConfirm={() => {
          setShowUnsavedDialog(false);
          pendingActionRef.current?.();
        }}
        onCancel={() => setShowUnsavedDialog(false)}
      />

      <ConfirmDialog
        visible={showDeleteDialog}
        title="Delete note"
        message="Are you sure?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        destructive
        onConfirm={() => {
          setShowDeleteDialog(false);
          dispatch(deleteNote(noteId));
          navigation.goBack();
        }}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </KeyboardAvoidingView>
  );
}

export default NoteDetailScreen;
