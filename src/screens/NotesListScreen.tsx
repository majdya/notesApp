import { useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addNote, deleteNote, updateNote, Note } from '../store/notesSlice';
import NoteCard from '../components/NoteCard';
import ConfirmDialog from '../components/ConfirmDialog';
import { RootStackParamList } from '../navigation/AppNavigator';
import { getCurrentLocation } from '../utils/location';

import FieldError from '../components/FieldError';
import { validateNoteTitle, validateNoteContent } from '../utils/validations';

type NotesListNavProp = NativeStackNavigationProp<
  RootStackParamList,
  'NotesList'
>;

interface Props {
  navigation: NotesListNavProp;
}

const KEYBOARD_BEHAVIOR: 'padding' | undefined =
  Platform.OS === 'ios' ? 'padding' : undefined;

function ListEmpty() {
  return (
    <View className="flex-1 items-center justify-center px-8">
      <Text className="text-lg font-semibold text-text-primary">
        No notes yet
      </Text>
      <Text className="mt-1 text-center text-sm text-text-secondary">
        Tap the button below to create your first note
      </Text>
    </View>
  );
}

function NotesListScreen({ navigation }: Props) {
  const { notes } = useAppSelector(state => state.notes);
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [contentError, setContentError] = useState<string | null>(null);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);

  function handleTitleChange(text: string) {
    setTitle(text);
    setTitleError(validateNoteTitle(text));
  }

  function handleContentChange(text: string) {
    setContent(text);
    setContentError(validateNoteContent(text));
  }

  function handleCreate() {
    const titleErr = validateNoteTitle(title);
    const contentErr = validateNoteContent(content);
    setTitleError(titleErr);
    setContentError(contentErr);
    if (titleErr || contentErr) return;

    const { payload: newNote } = dispatch(addNote(title, content, null, null));

    setTitle('');
    setContent('');
    setTitleError(null);
    setContentError(null);
    setShowForm(false);

    getCurrentLocation().then(location => {
      if (!location) {
        console.warn('No location available for note', newNote.id);
        return;
      }
      dispatch(
        updateNote({
          id: newNote.id,
          title: title.trim(),
          content: content.trim(),
          latitude: location.latitude,
          longitude: location.longitude,
        }),
      );
    });
  }

  function handleCancel() {
    setTitle('');
    setContent('');
    setTitleError(null);
    setContentError(null);
    setShowForm(false);
  }

  function handleDelete(note: Note) {
    setNoteToDelete(note);
  }

  function handlePress(note: Note) {
    navigation.navigate('NoteDetail', { noteId: note.id });
  }

  return (
    <KeyboardAvoidingView
      behavior={KEYBOARD_BEHAVIOR}
      className="flex-1 bg-background"
      style={{ paddingTop: insets.top }}
    >
      <View className="px-5 pt-4 pb-2">
        <Text className="text-[28px] font-bold tracking-tight text-text-primary">
          Notes
        </Text>
        {notes.length > 0 && (
          <Text className="mt-0.5 text-sm text-text-secondary">
            {notes.length} {notes.length === 1 ? 'note' : 'notes'}
          </Text>
        )}
      </View>

      <Modal
        visible={showForm}
        transparent
        animationType="slide"
        onRequestClose={handleCancel}
      >
        <Pressable className="flex-1 bg-black/40" onPress={handleCancel}>
          <KeyboardAvoidingView
            behavior={KEYBOARD_BEHAVIOR}
            className="justify-end flex-1"
          >
            <Pressable
              className="rounded-t-2xl bg-surface px-5 pt-3 pb-6"
              onPress={e => e.stopPropagation()}
            >
              <View className="mx-auto mb-4 h-1 w-8 rounded-full bg-border" />
              <Text className="mb-4 text-lg font-semibold text-text-primary">
                New Note
              </Text>
              <TextInput
                className="rounded-input border border-border px-3 py-3 text-base text-text-primary"
                placeholder="Note title"
                placeholderTextColor="#aeaeb2"
                value={title}
                onChangeText={handleTitleChange}
              />
              <FieldError error={titleError} />
              <TextInput
                className="mt-3 min-h-[100px] rounded-input border border-border px-3 py-3 text-base text-text-primary"
                placeholder="Note content"
                placeholderTextColor="#aeaeb2"
                value={content}
                onChangeText={handleContentChange}
                multiline
                textAlignVertical="top"
              />
              <FieldError error={contentError} />
              <View className="mt-5 flex-row gap-3">
                <Pressable
                  className="flex-1 rounded-button border border-border py-3"
                  onPress={handleCancel}
                >
                  <Text className="text-center text-base font-medium text-text-primary">
                    Cancel
                  </Text>
                </Pressable>
                <Pressable
                  disabled={!title.trim()}
                  className={`flex-1 rounded-button py-3 
                    ${title.trim() ? 'bg-primary' : 'bg-primary/20'}`}
                  onPress={handleCreate}
                >
                  <Text className="text-center text-base font-semibold text-white">
                    Save
                  </Text>
                </Pressable>
              </View>
            </Pressable>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>

      <FlatList
        data={notes}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <NoteCard
            note={item}
            onPress={handlePress}
            onLongPress={handleDelete}
          />
        )}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={
          notes.length === 0
            ? { flex: 1 }
            : { paddingBottom: 100, paddingTop: 4 }
        }
      />

      {!showForm && (
        <Pressable
          className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-fab bg-primary shadow-lg"
          style={{
            bottom: insets.bottom + 24,
            shadowColor: '#00994E',
            shadowOpacity: 0.35,
            shadowRadius: 10,
          }}
          onPress={() => setShowForm(true)}
        >
          <Text className="text-3xl leading-8 text-white">+</Text>
        </Pressable>
      )}

      <ConfirmDialog
        visible={noteToDelete !== null}
        title="Delete note"
        message="Are you sure?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        destructive
        onConfirm={() => {
          if (noteToDelete) dispatch(deleteNote(noteToDelete.id));
          setNoteToDelete(null);
        }}
        onCancel={() => setNoteToDelete(null)}
      />
    </KeyboardAvoidingView>
  );
}

export default NotesListScreen;
