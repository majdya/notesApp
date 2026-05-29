import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NotesListScreen from '../screens/NotesListScreen';
import NoteDetailScreen from '../screens/NoteDetailScreen';

export type RootStackParamList = {
  NotesList: undefined;
  NoteDetail: { noteId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="NotesList" component={NotesListScreen} />
      <Stack.Screen
        name="NoteDetail"
        component={NoteDetailScreen}
        options={{
          headerShown: true,
          headerTitle: 'Note',
          headerBackTitle: 'Back',
        }}
      />
    </Stack.Navigator>
  );
}

export default AppNavigator;
