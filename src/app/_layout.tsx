import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppProvider } from '@/store/AppContext';
import { TasksProvider } from '@/store/TasksContext';
import { FocusProvider } from '@/store/FocusContext';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <TasksProvider>
          <FocusProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="add-task" options={{ presentation: 'modal' }} />
              <Stack.Screen name="task/[id]" options={{ presentation: 'modal' }} />
            </Stack>
          </FocusProvider>
        </TasksProvider>
      </AppProvider>
    </GestureHandlerRootView>
  );
}
