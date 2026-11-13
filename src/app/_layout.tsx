// Import each weight from its own path so only these four font files ship.
import { Onest_400Regular } from '@expo-google-fonts/onest/400Regular';
import { Onest_500Medium } from '@expo-google-fonts/onest/500Medium';
import { Onest_600SemiBold } from '@expo-google-fonts/onest/600SemiBold';
import { Onest_700Bold } from '@expo-google-fonts/onest/700Bold';
import { useFonts } from 'expo-font';
import { DefaultTheme, Tabs, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { AppTabBar } from '@/components/app-tabs';
import { GlobalModals } from '@/components/global-modals';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { C } from '@/constants/design';
import '@/global.css';
import { ModalProvider } from '@/contexts/modal-context';

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

SplashScreen.preventAutoHideAsync();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: C.white,
    card: C.white,
    text: C.ink,
    border: C.border,
    primary: C.brand,
  },
};

const renderTabBar = (props: any) => <AppTabBar {...props} />;

function AppNavigation() {
  return (
    <ThemeProvider value={navTheme}>
      <StatusBar style="light" />
      <AnimatedSplashOverlay />
      <Tabs tabBar={renderTabBar} screenOptions={{ headerShown: false, freezeOnBlur: true }}>
        <Tabs.Screen name="index" options={{ title: 'Home' }} />
        <Tabs.Screen name="explore" options={{ title: 'Templates' }} />
        <Tabs.Screen name="studio" options={{ title: 'Create' }} />
        <Tabs.Screen name="inbox" options={{ title: 'Inbox' }} />
        <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
      </Tabs>
      <GlobalModals />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  // Only the four weights the UI uses. The native splash stays up until they load.
  const [fontsLoaded, fontError] = useFonts({
    Onest_400Regular,
    Onest_500Medium,
    Onest_600SemiBold,
    Onest_700Bold,
  });

  if (!fontsLoaded && !fontError) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary>
        <ModalProvider>
          <AppNavigation />
        </ModalProvider>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}
