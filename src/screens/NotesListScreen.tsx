import { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addNote, deleteNote, Note } from '../store/notesSlice';
import NoteCard from '../components/NoteCard';
import { RootStackParamList } from '../navigation/AppNavigator';
import { getCurrentLocation } from '../hooks/useLocation';

import FieldError from '../components/FieldError';
import { validateNoteTitle, validateNoteContent } from '../utils/validations';

type NotesListNavProp = NativeStackNavigationProp<
  RootStackParamList,
  'NotesList'
>;

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationFeedback, setLocationFeedback] = useState<string | null>(null);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [contentError, setContentError] = useState<string | null>(null);

  const handleTitleChange = useCallback((text: string) => {
    setTitle(text);
    setTitleError(validateNoteTitle(text));
  }, []);

  const handleContentChange = useCallback((text: string) => {
    setContent(text);
    setContentError(validateNoteContent(text));
  }, []);

  const handleCreate = useCallback(async () => {
    const titleErr = validateNoteTitle(title);
    const contentErr = validateNoteContent(content);
    setTitleError(titleErr);
    setContentError(contentErr);
    if (titleErr || contentErr) return;

    setIsSubmitting(true);
    setLocationFeedback(null);

    try {
      const location = await getCurrentLocation();
      if (!location) {
        setLocationFeedback(
          'Could not fetch location. Note saved without coordinates.',
        );
      }

      dispatch(addNote(title, content, location?.latitude, location?.longitude));
    } catch {
      setLocationFeedback('Something went wrong. Note saved without location.');
      dispatch(addNote(title, content, null, null));
    }

    setTitle('');
    setContent('');
    setTitleError(null);
    setContentError(null);
    setShowForm(false);
    setIsSubmitting(false);
  }, [title, content, dispatch]);

  const handleCancel = useCallback(() => {
    setTitle('');
    setContent('');
    setTitleError(null);
    setContentError(null);
    setShowForm(false);
  }, []);

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
      <NoteCard note={item} onPress={handlePress} onLongPress={handleDelete} />
    ),
    [handlePress, handleDelete],
  );

  const renderEmpty = useCallback(
    () => (
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg font-semibold text-text-tertiary">
          No notes yet
        </Text>
        <Text className="text-sm text-text-tertiary mt-1">
          Tap the + button to create one
        </Text>
      </View>
    ),
    [],
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-background"
      style={{ paddingTop: insets.top }}
    >
      {showForm && (
        <View className="mx-4 mt-3 rounded-card bg-surface p-4 shadow-sm">
          <TextInput
            className="mb-1 rounded-input border border-border px-3 py-3 text-base text-text-primary"
            placeholder="Note title"
            placeholderTextColor="#999"
            value={title}
            onChangeText={handleTitleChange}
            editable={!isSubmitting}
          />
          <FieldError error={titleError} />
          <TextInput
            className="mb-1 min-h-[80px] rounded-input border border-border px-3 py-3 text-base text-text-primary"
            placeholder="Note content"
            placeholderTextColor="#999"
            value={content}
            onChangeText={handleContentChange}
            multiline
            textAlignVertical="top"
            editable={!isSubmitting}
          />
          <FieldError error={contentError} />
          {locationFeedback && (
            <Text className="mb-1 text-xs text-text-tertiary">
              {locationFeedback}
            </Text>
          )}
          <View className="mt-1 flex-row justify-end gap-3">
            <Pressable onPress={handleCancel} disabled={isSubmitting}>
              <Text className="px-4 py-2 text-base text-text-secondary">
                Cancel
              </Text>
            </Pressable>
            <Pressable
              disabled={!title.trim() || isSubmitting}
              className={`rounded-button px-5 py-2 
                ${title.trim() && !isSubmitting ? 'bg-primary' : 'bg-primary/20'}`}
              onPress={handleCreate}
            >
              {isSubmitting ? (
                <View className="flex-row items-center gap-2">
                  <ActivityIndicator color="#fff" size="small" />
                  <Text className="text-base font-semibold text-white">
                    Locating...
                  </Text>
                </View>
              ) : (
                <Text className="text-base font-semibold text-white">Save</Text>
              )}
            </Pressable>
          </View>
        </View>
      )}

      <FlatList
        data={notes}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={
          notes.length === 0 ? { flex: 1 } : { paddingVertical: 8 }
        }
      />

      {!showForm && (
        <Pressable
          className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-fab bg-primary shadow-lg"
          style={{
            bottom: insets.bottom + 24,
            shadowColor: '#007AFF',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
          }}
          onPress={() => setShowForm(true)}
        >
          <Text className="text-3xl leading-8 text-white">+</Text>
        </Pressable>
      )}
    </KeyboardAvoidingView>
  );
}

export default NotesListScreen;
