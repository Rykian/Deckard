import { gql } from '@apollo/client'
import { useMutation } from '@apollo/client/react'
import RNDateTimePicker from '@react-native-community/datetimepicker'
import { Button, Layout, Text } from '@ui-kitten/components'
import { addMinutes } from 'date-fns'
import { useState } from 'react'
import { StepProps } from '.'
import {
  StartStreamingMutation,
  StartStreamingMutationVariables,
} from '../../../../../gql/graphql'
import { styles } from '../styles'

const START_STREAMING = gql`
  mutation StartStreaming($target: String) {
    streamSequenceStart(targetedTime: $target)
  }
`

const StartCountdown = (props: StepProps) => {
  const [startDate, setStartDate] = useState(addMinutes(new Date(), 10))
  const [startStreaming] = useMutation<
    StartStreamingMutation,
    StartStreamingMutationVariables
  >(START_STREAMING)

  return (
    <Layout style={{ flex: 1 }}>
      <Layout style={{ flex: 1 }}>
        <Layout
          style={{ flexDirection: 'row', justifyContent: 'center', margin: 20 }}
        >
          <Text style={{ alignSelf: 'center' }}>Countdown end date:</Text>
          <RNDateTimePicker
            mode="time"
            value={startDate}
            onChange={(e) =>
              e.nativeEvent.timestamp &&
              setStartDate(new Date(e.nativeEvent.timestamp))
            }
          />
        </Layout>
      </Layout>
      <Button
        onPress={async () => {
          await startStreaming({
            variables: { target: startDate.toISOString() },
          })
          props.nextStep()
        }}
        style={styles.nextButton}
      >
        Next
      </Button>
    </Layout>
  )
}

export default StartCountdown
