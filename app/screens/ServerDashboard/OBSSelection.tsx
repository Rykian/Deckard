import { gql, useMutation, useQuery } from '@apollo/client'
import { faRefresh } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Button, Card, Layout, List, Text } from '@ui-kitten/components'
import { useEffect } from 'react'
import { ListRenderItem } from 'react-native'
import { ServerDashboardStackParamList } from '.'
import {
  ListObsInstancesQuery,
  SelectObsInstanceMutation,
  SelectObsInstanceMutationVariables,
} from '../../gql/graphql'

type Props = NativeStackScreenProps<
  ServerDashboardStackParamList,
  'OBSSelection'
>

const LIST_OBS_INSTANCES = gql`
  query ListObsInstances {
    obsInstanceList {
      ip
      port
      hostname
    }
  }
`

const SELECT_OBS_INSTANCE = gql`
  mutation SelectOBSInstance($host: String!, $port: String!) {
    obsConnect(host: $host, port: $port)
  }
`

const OBSSelection = (props: Props) => {
  const listQuery = useQuery<ListObsInstancesQuery>(LIST_OBS_INSTANCES)
  const [selectMutation] = useMutation<
    SelectObsInstanceMutation,
    SelectObsInstanceMutationVariables
  >(SELECT_OBS_INSTANCE)

  useEffect(() => {
    props.navigation.setOptions({
      title: 'Switch OBS instance',
      headerRight: () => (
        <Button appearance="ghost" onPress={() => listQuery.refetch()}>
          <FontAwesomeIcon icon={faRefresh} />
        </Button>
      ),
    })
  }, [])

  const renderItem: ListRenderItem<
    ListObsInstancesQuery['obsInstanceList'][0]
  > = ({ item }) => (
    <Card
      onPress={() =>
        selectMutation({ variables: { host: item.ip, port: item.port } }).then(() => props.navigation.goBack())
      }
    >
      <Text>
        {item.ip}:{item.port}
        {item.hostname && <> ({item.hostname})</>}
      </Text>
    </Card>
  )

  return (
    <Layout style={{ flex: 1 }}>
      <List data={listQuery.data?.obsInstanceList} renderItem={renderItem} />
    </Layout>
  )
}

export default OBSSelection
