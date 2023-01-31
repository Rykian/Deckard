import { RootStackParamList } from '../../router'
import { Layout, Text } from '@ui-kitten/components'
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack'
import { useEffect, useMemo } from 'react'
import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  split,
} from '@apollo/client'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import Home from './Home'
import OBSSelection from './OBSSelection'
import { createClient } from 'graphql-ws'
import { getMainDefinition } from '@apollo/client/utilities'
import useApolloClient from '../../utils/useApolloClient'

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>

export type ServerDashboardStackParamList = {
  Home: undefined
  OBSSelection: undefined
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
        </Stack.Group>
      </Stack.Navigator>
    </ApolloProvider>
  )
}

export default ServerDashboardScreen
