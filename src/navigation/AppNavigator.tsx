import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import NotesListScreen from '../screens/NotesListScreen';
import NoteDetailScreen from '../screens/NoteDetailScreen';
import MapScreen from '../screens/MapScreen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import type { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  NotesList: undefined;
  NoteDetail: { noteId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function NotesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
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

function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#00994E',
        tabBarInactiveTintColor: '#aeaeb2',
      }}
    >
      <Tab.Screen
        name="NotesTab"
        component={NotesStack}
        options={{
          tabBarLabel: 'Notes',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="notes" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="MapTab"
        component={MapScreen}
        options={{
          tabBarLabel: 'Map',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="map" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default AppNavigator;

export type RootTabParamList = {
  NotesTab: NavigatorScreenParams<RootStackParamList>;
  MapTab: undefined;
};
