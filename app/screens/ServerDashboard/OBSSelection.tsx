import { gql } from '@apollo/client'
import { useMutation, useQuery } from '@apollo/client/react'
import { faRefresh, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Button, Card, Layout, List, Text } from '@ui-kitten/components'
import { useEffect, useRef } from 'react'
import { Animated, ListRenderItem } from 'react-native'
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
  const rotationValue = useRef(new Animated.Value(0)).current

  const [selectMutation] = useMutation<
    SelectObsInstanceMutation,
    SelectObsInstanceMutationVariables
  >(SELECT_OBS_INSTANCE)

  useEffect(() => {
    if (listQuery.loading) {
      Animated.loop(
        Animated.timing(rotationValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ).start()
    } else {
      rotationValue.setValue(0)
    }
  }, [listQuery.loading, rotationValue])

  const rotation = rotationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  })

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
        selectMutation({ variables: { host: item.ip, port: item.port } }).then(
          () => props.navigation.goBack(),
        )
      }
    >
      <Text>
        {item.ip}:{item.port}
        {item.hostname ? ` (${item.hostname})` : ''}
      </Text>
    </Card>
  )

  return (
    <Layout style={{ flex: 1 }}>
      <List
        data={listQuery.data?.obsInstanceList}
        renderItem={renderItem}
        style={{ opacity: listQuery.loading ? 0.5 : 1 }}
      />
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
          transform: [{ rotate: rotation }],
          opacity: listQuery.loading ? 1 : 0,
          pointerEvents: listQuery.loading ? 'none' : 'auto',
        }}
      >
        <FontAwesomeIcon icon={faSpinner} size={32} />
      </Animated.View>
    </Layout>
  )
}

export default OBSSelection
