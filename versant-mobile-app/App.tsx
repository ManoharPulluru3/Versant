import './global.css'
import { Component, type ReactNode } from 'react'
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native'
import { StatusBar, Text, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { enableScreens } from 'react-native-screens'
import { ThemeProvider, useTheme } from './src/context/ThemeContext'
import { navigationRef } from './src/navigation/navigationRef'
import { RootNavigator } from './src/navigation/RootNavigator'

enableScreens(true)

class ErrorBoundary extends Component<{ children: ReactNode }, { message: string | null }> {
  state = { message: null as string | null }

  static getDerivedStateFromError(error: Error) {
    return { message: error.message }
  }

  render() {
    if (this.state.message) {
      return (
        <View style={{ flex: 1, backgroundColor: '#fff', padding: 24, justifyContent: 'center' }}>
          <Text style={{ color: '#991b1b', fontSize: 16, fontWeight: '700' }}>App failed to open</Text>
          <Text style={{ color: '#17221d', marginTop: 12 }}>{this.state.message}</Text>
        </View>
      )
    }
    return this.props.children
  }
}

function AppShell() {
  const { darkMode, colors } = useTheme()
  const navigationTheme = {
    ...(darkMode ? DarkTheme : DefaultTheme),
    colors: {
      ...(darkMode ? DarkTheme.colors : DefaultTheme.colors),
      background: colors.canvas,
      card: colors.card,
      text: colors.text,
      border: colors.cardBorder,
      primary: colors.brand,
    },
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.canvas }}>
      <SafeAreaProvider style={{ flex: 1, backgroundColor: colors.canvas }}>
        <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />
        <NavigationContainer ref={navigationRef} theme={navigationTheme}>
          <RootNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AppShell />
      </ThemeProvider>
    </ErrorBoundary>
  )
}
