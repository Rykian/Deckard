import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack'

export type Routes = {
  Button: undefined
  Start: undefined
  Pause: undefined
  Stop: undefined
}

export const Stack = createNativeStackNavigator<Routes>()

export type StartButtonRouteProps = NativeStackScreenProps<Routes>
