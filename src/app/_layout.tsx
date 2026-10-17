import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { LiquidGlassTabBar } from '@/components/app-tabs';
import { GlobalModals } from '@/components/global-modals';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import '@/global.css';
import { useTheme } from '@/hooks/use-theme';
import { AppProvider } from '@/providers/app-provider';
import { DefaultTheme, Tabs, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';



// Configure Reanimated Logger per official documentation to disable strict mode reading/writing value warnings
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

SplashScreen.preventAutoHideAsync();

function AppNavigation() {
  const { colors } = useTheme();

  const navTheme = React.useMemo(
    () => ({
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        background: colors.background,
        card: colors.surface,
        text: colors.primaryText,
        border: colors.border,
        primary: colors.plum,
      },
    }),
    [colors.background, colors.surface, colors.primaryText, colors.border, colors.plum]
  );

  const renderTabBar = React.useCallback(
    (props: any) => <LiquidGlassTabBar {...props} />,
    []
  );

  return (
    <ThemeProvider value={navTheme}>
      <StatusBar style="dark" />
      <AnimatedSplashOverlay />
      <Tabs
        tabBar={renderTabBar}
        screenOptions={{
          headerShown: false,
          freezeOnBlur: true,
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Search',
          }}
        />
        <Tabs.Screen
          name="studio"
          options={{
            title: 'Create',
          }}
        />
        <Tabs.Screen
          name="inbox"
          options={{
            title: 'Inbox',
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Profile',
          }}
        />
      </Tabs>
      <GlobalModals />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary>
        <AppProvider>
          <AppNavigation />
        </AppProvider>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}
