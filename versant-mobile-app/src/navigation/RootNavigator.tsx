import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { ListeningPracticeScreen } from '../screens/listening/ListeningPracticeScreen'
import { ListeningQuestionsScreen } from '../screens/listening/ListeningQuestionsScreen'
import { ListeningResultScreen } from '../screens/listening/ListeningResultScreen'
import { ListeningSessionScreen } from '../screens/listening/ListeningSessionScreen'
import { ListeningTaskScreen } from '../screens/listening/ListeningTaskScreen'
import { ForgotPasswordScreen } from '../screens/ForgotPasswordScreen'
import { LoginScreen } from '../screens/LoginScreen'
import { SplashScreen } from '../screens/SplashScreen'
import {
  AssessmentDetailsScreen,
  DeviceCheckScreen,
  NotificationsScreen,
  PracticeSkillScreen,
} from '../screens/StackScreens'
import { MainTabs } from './MainTabs'
import type { RootStackParamList } from './types'

const Stack = createNativeStackNavigator<RootStackParamList>()

export function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
      <Stack.Screen name="Splash" component={SplashScreen} options={{ animation: 'none' }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ animation: 'fade' }} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="Main" component={MainTabs} options={{ animation: 'fade' }} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="PracticeSkill" component={PracticeSkillScreen} />
      <Stack.Screen name="ListeningPractice" component={ListeningPracticeScreen} />
      <Stack.Screen name="ListeningSession" component={ListeningSessionScreen} />
      <Stack.Screen name="ListeningQuestions" component={ListeningQuestionsScreen} options={{ gestureEnabled: false }} />
      <Stack.Screen name="ListeningTask" component={ListeningTaskScreen} options={{ gestureEnabled: false }} />
      <Stack.Screen name="ListeningResult" component={ListeningResultScreen} />
      <Stack.Screen name="AssessmentDetails" component={AssessmentDetailsScreen} />
      <Stack.Screen name="DeviceCheck" component={DeviceCheckScreen} />
    </Stack.Navigator>
  )
}

export type { RootStackParamList } from './types'
