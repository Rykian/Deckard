import { gql } from '@apollo/client'
import { useMutation, useQuery, useSubscription } from '@apollo/client/react'
import { Button, CheckBox, Layout, Text } from '@ui-kitten/components'
import { useEffect, useMemo, useState } from 'react'
import { StepProps } from '.'
import {
  ListStartScenesQuery,
  StartImmediatelyMutation,
  StartImmediatelyMutationVariables,
  StartTimerCountdownSubscription,
  ToggleStartStreamOnExpiringMutation,
  ToggleStartStreamOnExpiringMutationVariables,
} from '../../../../../gql/graphql'
import { useStoreActions, useStoreState } from '../../../../../store'
import DropDownPicker from 'react-native-dropdown-picker'
import useCountdownDisplay from '../../../../../utils/useCountdownDisplay'
import { styles } from '../styles'

const TIMER = gql`
  subscription StartTimerCountdown {
    streamCountdownUpdated(name: "start")
  }
`

const TOGGLE_START_STREAM_ON_EXPIRING = gql`
  mutation ToggleStartStreamOnExpiring($scene: String!) {
    streamSequenceStartToggleOnCountdownExpiring(scene: $scene)
  }
`

const START_IMMEDIATELY = gql`
  mutation StartImmediately($scene: String!) {
    streamSequenceStartImmediatly(scene: $scene)
  }
`

const LIST_SCENES = gql`
  query ListStartScenes {
    obsScenesList
  }
`

const Checklist = (props: StepProps) => {
  const checklist = useStoreState((s) => s.buttons.start.checklist)
  const allChecked = useStoreState((s) => s.buttons.start.allChecked)
  const toggle = useStoreActions((a) => a.buttons.start.toggle)
  const timerSub = useSubscription<StartTimerCountdownSubscription>(TIMER)
  const timer = useCountdownDisplay(timerSub.data?.streamCountdownUpdated)

  const listSceneQuery = useQuery<ListStartScenesQuery>(LIST_SCENES)
  const sceneList = useMemo(
    () =>
      listSceneQuery.data?.obsScenesList.filter((scene) =>
        scene.startsWith('scene-'),
      ),
    [listSceneQuery.data?.obsScenesList],
  )

  const [startScene, setStartScene] = useState<string>()
  useEffect(() => {
    setStartScene(sceneList?.[0])
  }, [sceneList])

  const [startOnExpiration, checkedResult] = useMutation<
    ToggleStartStreamOnExpiringMutation,
    ToggleStartStreamOnExpiringMutationVariables
  >(TOGGLE_START_STREAM_ON_EXPIRING)
  const [pickerOpen, setPickerOpen] = useState(false)

  const [startImmediately] = useMutation<
    StartImmediatelyMutation,
    StartImmediatelyMutationVariables
  >(START_IMMEDIATELY)

  return (
    <Layout style={{ flex: 1 }}>
      <Layout style={{ flex: 1 }}>
        {Object.entries(checklist).map(([title, checked]) => (
          <CheckBox
            key={title}
            checked={checked}
            onChange={() => toggle(title)}
            style={{ margin: 5 }}
          >
            {title}
          </CheckBox>
        ))}
      </Layout>
      <Layout
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <CheckBox
          disabled={!allChecked}
          checked={
            checkedResult.data?.streamSequenceStartToggleOnCountdownExpiring ??
            false
          }
          onChange={() =>
            startScene &&
            startOnExpiration({ variables: { scene: startScene } })
          }
        >
          <Text>
            Start on timer expiration (left: {timer ?? ''}) and go to{' '}
          </Text>
        </CheckBox>
        {sceneList && (
          <DropDownPicker
            style={{ width: '30%' }}
            items={sceneList.map((name) => ({ label: name, value: name }))}
            open={pickerOpen}
            setOpen={setPickerOpen}
            value={startScene ?? null}
            setValue={setStartScene}
          />
        )}
      </Layout>
      <Button
        onPress={async () => {
          if (!startScene) return

          await startImmediately({ variables: { scene: startScene } })
          props.navigation.navigate('Home')
        }}
        disabled={!allChecked}
        style={styles.nextButton}
      >
        Start now
      </Button>
    </Layout>
  )
}
export default Checklist
