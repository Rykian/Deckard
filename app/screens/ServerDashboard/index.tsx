import { RootStackParamList } from '../../App'
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack'
import { useEffect } from 'react'
import { ApolloProvider } from '@apollo/client/react'
import Home from './Home'
import OBSSelection from './OBSSelection'
import useApolloClient from '../../utils/useApolloClient'
import TwitchLogin from './TwitchLogin'
import PrepareStart from './buttons/Start/PrepareStart'
import Pause from './buttons/Start/Pause'
import Stop from './buttons/Start/Stop'

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>

export type ServerDashboardStackParamList = {
  Home: undefined
  OBSSelection: undefined
  TwitchLogin: { address?: string }
  'StartButton/Start': undefined
  'StartButton/Pause': undefined
  'StartButton/Stop': undefined
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
          <Stack.Screen
            name="TwitchLogin"
            component={TwitchLogin}
            initialParams={{ address }}
          />
          <Stack.Screen name="StartButton/Start" component={PrepareStart} />
          <Stack.Screen name="StartButton/Pause" component={Pause} />
          <Stack.Screen name="StartButton/Stop" component={Stop} />
        </Stack.Group>
      </Stack.Navigator>
    </ApolloProvider>
  )
}

export default ServerDashboardScreen
