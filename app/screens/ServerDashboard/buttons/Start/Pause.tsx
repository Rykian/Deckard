import { gql, useMutation } from '@apollo/client'
import RNDateTimePicker from '@react-native-community/datetimepicker'
import { Button, Layout, Text } from '@ui-kitten/components'
import { addMinutes } from 'date-fns'
import { useEffect, useMemo, useState } from 'react'

import { StartButtonRouteProps, styles } from '.'
import {
  PauseStreamMutation,
  PauseStreamMutationVariables,
  SetPauseTimerMutation,
  SetPauseTimerMutationVariables,
  UnpauseStreamMutation,
  UnpauseStreamMutationVariables,
} from '../../../../gql/graphql'
import useCountdownDisplay from '../../../../utils/useCountdownDisplay'

const PAUSE = gql`
  mutation PauseStream {
    streamSequencePause
  }
`

const UNPAUSE = gql`
  mutation UnpauseStream($scene: String) {
    streamSequencePauseUnpause(scene: $scene)
  }
`

const SET_TIMER = gql`
  mutation SetPauseTimer($resumeDate: String!) {
    streamCountdownSet(target: $resumeDate, name: "pause")
  }
`

const Pause = (props: StartButtonRouteProps) => {
  const [setPauseTimer] = useMutation<
    SetPauseTimerMutation,
    SetPauseTimerMutationVariables
  >(SET_TIMER)
  const [pause, pauseResult] = useMutation<
    PauseStreamMutation,
    PauseStreamMutationVariables
  >(PAUSE)
  const [unpause] = useMutation<
    UnpauseStreamMutation,
    UnpauseStreamMutationVariables
  >(UNPAUSE)
  useEffect(() => {
    pause()
  }, [])
  const [resumeDate, setResumeDate] = useState<Date>(addMinutes(new Date(), 5))
  const time = useCountdownDisplay(resumeDate)

  const unpauseScene = useMemo(() => {
    return pauseResult.data?.streamSequencePause
  }, [pauseResult.data])

  return (
    <>
      <Layout style={{ flex: 1 }}>
        <Layout
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text>Pause until</Text>
          <RNDateTimePicker
            mode="time"
            value={resumeDate}
            onChange={(e) => setResumeDate(new Date(e.nativeEvent.timestamp))}
          />
          <Text>({time})</Text>
        </Layout>

        <Button
          onPress={() =>
            setPauseTimer({
              variables: { resumeDate: resumeDate.toISOString() },
            })
          }
        >
          Set timer
        </Button>
      </Layout>
      <Button
        style={styles.nextButton}
        onPress={async () => {
          await unpause()
          props.navigation.navigate('Button')
        }}
      >
        <Text>Unpause (switch to scene "{unpauseScene}")</Text>
      </Button>
    </>
  )
}

export default Pause
