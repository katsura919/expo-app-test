import { Redirect } from 'expo-router';
import { View } from 'react-native';
import { useApp } from '@/store/AppContext';

export default function Index() {
  const { appState, isLoading, needsBoot } = useApp();

  if (isLoading) {
    return <View style={{ flex: 1, backgroundColor: '#000000' }} />;
  }

  if (!appState.onboardingDone) {
    return <Redirect href="/onboarding" />;
  }

  if (needsBoot) {
    return <Redirect href="/boot" />;
  }

  return <Redirect href="/(tabs)" />;
}
