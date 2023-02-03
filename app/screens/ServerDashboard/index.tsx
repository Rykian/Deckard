import { RootStackParamList } from '../../App'
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack'
import { useEffect } from 'react'
import { ApolloProvider } from '@apollo/client'
import Home from './Home'
import OBSSelection from './OBSSelection'
import useApolloClient from '../../utils/useApolloClient'
import SpotifyLogin from './SpotifyLogin'
import TwitchLogin from './TwitchLogin'

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>

export type ServerDashboardStackParamList = {
  Home: undefined
  OBSSelection: undefined
  SpotifyLogin: undefined
  TwitchLogin: undefined
}

const Stack = createNativeStackNavigator<ServerDashboardStackParamList>()

const ServerDashboardScreen = (props: Props) => {
  const address = props.route.params?.address

  useEffect(() => {
    props.navigation.setOptions({ title: `Dashboard (${address})` })
  }, [])

  const client = useApolloClient(address)

  if (!client) {
    props.navigation.goBack()
    return null
  }

  return (
    <ApolloProvider client={client}>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Group screenOptions={{ presentation: 'modal' }}>
          <Stack.Screen name="OBSSelection" component={OBSSelection} />
          <Stack.Screen name="SpotifyLogin" component={SpotifyLogin} />
          <Stack.Screen name="TwitchLogin" component={TwitchLogin} />
        </Stack.Group>
      </Stack.Navigator>
    </ApolloProvider>
  )
}

export default ServerDashboardScreen
