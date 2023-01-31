import { gql, useQuery, useSubscription } from '@apollo/client'
import { faChromecast } from '@fortawesome/free-brands-svg-icons'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Layout, Text } from '@ui-kitten/components'
import { StyleSheet } from 'react-native'
import ConnectionState from '../../components/ConnectionState'
import { ServerDashboardStackParamList } from '.'
import { ObsCurrentInstanceSubscription } from '../../gql/graphql'

const CURRENT_INSTANCE = gql`
  subscription obsCurrentInstance {
    obsCurrentInstanceUpdated
  }
`

type Props = NativeStackScreenProps<ServerDashboardStackParamList, 'Home'>

const Home = (props: Props) => {
  const currentInstanceSub =
    useSubscription<ObsCurrentInstanceSubscription>(CURRENT_INSTANCE)

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
        </Layout>
        <Text category="h1">Home</Text>
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
    alignItems: 'flex-start',
  },
})
