import './global.css';
import {
  StatusBar,
  useColorScheme,
  ActivityIndicator,
  View,
  AppState,
  Pressable,
  Text,
  Linking,
  BackHandler,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { NavigationContainer } from '@react-navigation/native';
import { store, persistor } from './store/store';
import AppNavigator from './navigation/AppNavigator';
import { requestLocationPermission } from './utils/location';
import { useEffect, useState } from 'react';
import ErrorBoundary from './components/ErrorBoundary';

function PermissionGuard({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<'loading' | 'granted' | 'denied'>(
    'loading',
  );

  useEffect(() => {
    requestLocationPermission().then(granted => {
      setStatus(granted ? 'granted' : 'denied');
    });
  }, []);

  useEffect(() => {
    const sub = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active' && status === 'denied') {
        requestLocationPermission().then(granted => {
          if (granted) setStatus('granted');
        });
      }
    });
    return () => sub.remove();
  }, [status]);

  if (status === 'loading') {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#00994E" />
      </View>
    );
  }

  if (status === 'denied') {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Text className="mb-2 text-lg font-semibold text-text-primary">
          Location permission required
        </Text>
        <Text className="mb-6 text-center text-sm text-text-secondary">
          This app needs location access to pin your notes on the map.
        </Text>
        <View className="gap-3">
          <Pressable
            className="rounded-button bg-primary px-6 py-3"
            onPress={() => Linking.openSettings()}
          >
            <Text className="text-base font-semibold text-white">
              Open Settings
            </Text>
          </Pressable>
          <Pressable
            className="rounded-button border border-border px-6 py-3"
            onPress={() => BackHandler.exitApp()}
          >
            <Text className="text-base font-medium text-text-primary">
              Exit App
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return <>{children}</>;
}

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <View className="flex-1 items-center justify-center bg-background">
            <ActivityIndicator size="large" color="#00994E" />
          </View>
        }
        persistor={persistor}
      >
        <SafeAreaProvider>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <ErrorBoundary>
            <NavigationContainer>
              <PermissionGuard>
                <AppNavigator />
              </PermissionGuard>
            </NavigationContainer>
          </ErrorBoundary>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
