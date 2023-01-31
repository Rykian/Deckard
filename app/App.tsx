import { StatusBar } from 'expo-status-bar'
import {
  ApplicationProvider,
  IconRegistry,
  Layout,
  Text,
} from '@ui-kitten/components'
import * as eva from '@eva-design/eva'
import ServerSelectionScreen from './screens/ServerSelection'
import { SafeAreaView, useColorScheme } from 'react-native'
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native'
import ServerDashboardScreen from './screens/ServerDashboard'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

export type RootStackParamList = {
  'Server selection': undefined
  Dashboard: { address: string }
}

export const Stack = createNativeStackNavigator<RootStackParamList>()

export default function App() {
  const [navigationTheme, evaTheme] =
    useColorScheme() === 'dark'
      ? [DarkTheme, eva.dark]
      : [DefaultTheme, eva.light]

  return (
    <ApplicationProvider {...eva} theme={evaTheme}>
      <Layout style={{flex: 1}}>
        <SafeAreaView style={{ flex: 1 }}>
          <NavigationContainer theme={navigationTheme}>
            <Stack.Navigator>
              <Stack.Screen
                name="Server selection"
                component={ServerSelectionScreen}
              />
              <Stack.Screen
                name="Dashboard"
                component={ServerDashboardScreen}
              />
            </Stack.Navigator>
            <StatusBar style="auto" />
          </NavigationContainer>
        </SafeAreaView>
      </Layout>
    </ApplicationProvider>
  )
}
