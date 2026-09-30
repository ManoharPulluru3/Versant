import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { BottomTabBar } from '../components/BottomTabBar'
import type { MainTabParamList } from './types'
import { HomeScreen } from '../screens/HomeScreen'
import { PracticeScreen, ProgressScreen, TestsScreen } from '../screens/TabPlaceholderScreen'
import { ProfileScreen } from '../screens/ProfileScreen'

const Tab = createBottomTabNavigator<MainTabParamList>()

export function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={props => <BottomTabBar {...props} />}
      screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Practice" component={PracticeScreen} />
      <Tab.Screen name="Tests" component={TestsScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  )
}
