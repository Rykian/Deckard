import { gql, useMutation } from '@apollo/client'
import { Button, Layout } from '@ui-kitten/components'

const STOP = gql`
  mutation StopStream {
    streamSequenceStop
  }
`

const Stop = () => {
  const [stop] = useMutation(STOP)
  return (
    <Layout style={{ flex: 1 }}>
      <Button onPress={() => stop()}>Stop</Button>
    </Layout>
  )
}

export default Stop
