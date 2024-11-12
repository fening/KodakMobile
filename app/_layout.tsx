// app/_layout.tsx
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../hooks/useAuth'; // Use your custom useAuth hook

export default function RootLayout() {
  const { isAuthenticated, checkAuthStatus } = useAuth();
  const [initializing, setInitializing] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const initAuth = async () => {
      await checkAuthStatus();
      setInitializing(false);
    };

    initAuth();
  }, []);

  useEffect(() => {
    if (initializing) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)'); // Redirect to home (index.tsx) when logged in
    } else if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login'); // Redirect to login if not authenticated
    }
  }, [isAuthenticated, initializing]);

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack>
      {/* Auth Screens */}
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      
      {/* Main App (Tabs) Screens */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      
      {/* Record Screens */}
      <Stack.Screen name="records/[id]" options={{ title: 'Record Details' }} />
      <Stack.Screen name="records/new" options={{ title: 'New Record' }} />
      <Stack.Screen name="records/[id]/edit" options={{ title: 'Edit Record' }} />

      {/* Not Found Page */}
      <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
    </Stack>
  );
}
