import { Redirect } from 'expo-router';
import { View } from 'react-native';
import { useApp } from '@/store/AppContext';

export default function Index() {
  const { appState, isLoading } = useApp();

  if (isLoading) {
    return <View style={{ flex: 1, backgroundColor: '#FFFDF5' }} />;
  }

  if (!appState.onboardingDone) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/(tabs)" />;
}
