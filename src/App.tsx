import './global.css';
import {
  StatusBar,
  useColorScheme,
  ActivityIndicator,
  View,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { NavigationContainer } from '@react-navigation/native';
import { store, persistor } from './store/store';
import AppNavigator from './navigation/AppNavigator';
import { requestLocationPermission } from './hooks/useLocation';
import { useEffect } from 'react';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  useEffect(() => {
    requestLocationPermission();
  }, []);

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
              <AppNavigator />
            </NavigationContainer>
          </ErrorBoundary>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
