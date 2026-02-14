import { gql } from '@apollo/client'
import { useMutation } from '@apollo/client/react'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { Button, Layout } from '@ui-kitten/components'
import { ServerDashboardStackParamList } from '../..'

const STOP = gql`
  mutation StopStream {
    streamSequenceStop
  }
`

const Stop = () => {
  const [stop] = useMutation(STOP)
  const navigation =
    useNavigation<NavigationProp<ServerDashboardStackParamList>>()

  return (
    <Layout style={{ flex: 1 }}>
      <Button
        onPress={async () => {
          await stop()
          navigation.navigate('Home')
        }}
      >
        Stop
      </Button>
    </Layout>
  )
}

export default Stop
