import { gql, useQuery, useSubscription } from '@apollo/client'
import {
  faChromecast,
  faSpotify,
  faTwitch,
} from '@fortawesome/free-brands-svg-icons'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Layout, Text } from '@ui-kitten/components'
import { StyleSheet } from 'react-native'
import ConnectionState from '../../components/ConnectionState'
import { ServerDashboardStackParamList } from '.'
import {
  ObsCurrentInstanceSubscription,
  SpotifyUserNameQuery,
  TwitchUserNameQuery,
} from '../../gql/graphql'
import StartButton from './buttons/Start'
import Scenes from './buttons/Scenes'

const CURRENT_INSTANCE = gql`
  subscription obsCurrentInstance {
    obsCurrentInstanceUpdated
  }
`

export const SPOTIFY_USERNAME = gql`
  query spotifyUserName {
    getSpotifyUserName
  }
`

export const TWITCH_USERNAME = gql`
  query twitchUserName {
    twitchGetUsername
  }
`

type Props = NativeStackScreenProps<ServerDashboardStackParamList, 'Home'>

const Home = (props: Props) => {
  const currentInstanceSub =
    useSubscription<ObsCurrentInstanceSubscription>(CURRENT_INSTANCE)

  const spotifyUserName = useQuery<SpotifyUserNameQuery>(SPOTIFY_USERNAME)
  const twitchUserName = useQuery<TwitchUserNameQuery>(TWITCH_USERNAME)

  return (
    <>
      <Layout style={style.container}>
        <Layout level="2" style={style.iconBar}>
          <ConnectionState
            onPress={() => props.navigation.navigate('OBSSelection')}
            icon={faChromecast}
            connected={!!currentInstanceSub.data?.obsCurrentInstanceUpdated}
          >
            OBS
          </ConnectionState>
          <ConnectionState
            onPress={() => props.navigation.navigate('SpotifyLogin')}
            connected={!!spotifyUserName.data}
            icon={faSpotify}
          >
            {spotifyUserName.data?.getSpotifyUserName || 'Not connected'}
          </ConnectionState>
          <ConnectionState
            onPress={() => props.navigation.navigate('TwitchLogin')}
            connected={!!twitchUserName.data?.twitchGetUsername}
            icon={faTwitch}
          >
            {twitchUserName.data?.twitchGetUsername || 'Not connected'}
          </ConnectionState>
        </Layout>
        <Text category="h1">Home</Text>
        <StartButton />

        <Layout level="3" style={{ flexDirection: 'row' }}>
          <Scenes />
        </Layout>
      </Layout>
    </>
  )
}

export default Home

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  iconBar: {
    flex: undefined,
    display: 'flex',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
})
