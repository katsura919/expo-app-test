import { Stack } from 'expo-router';
import { AppProvider } from '@/store/AppContext';
import { TasksProvider } from '@/store/TasksContext';
import { FocusProvider } from '@/store/FocusContext';

export default function RootLayout() {
  return (
    <AppProvider>
      <TasksProvider>
        <FocusProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </FocusProvider>
      </TasksProvider>
    </AppProvider>
  );
}
