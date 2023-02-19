import React from 'react'
import { gql, useMutation, useSubscription } from '@apollo/client'
import {
  CurrentSceneForSwitchesSubscription,
  ScenesListForSwitchesSubscription,
  SwitchSceneFromSwitchesMutation,
  SwitchSceneFromSwitchesMutationVariables,
} from '../../../../gql/graphql'
import Switch from '../../../../components/Switch'
import { faDisplay } from '@fortawesome/free-solid-svg-icons'

const SCENES = gql`
  subscription ScenesListForSwitches {
    obsScenesListUpdated
  }
`

const SWITCH = gql`
  mutation SwitchSceneFromSwitches($scene: String!) {
    obsScenesSwitch(scene: $scene)
  }
`

const CURRENT = gql`
  subscription CurrentSceneForSwitches {
    obsScenesCurrentChanged
  }
`

const Scenes = () => {
  const list = useSubscription<ScenesListForSwitchesSubscription>(
    SCENES,
  ).data?.obsScenesListUpdated.filter((scene) => scene.startsWith('scene-'))
  const current =
    useSubscription<CurrentSceneForSwitchesSubscription>(CURRENT).data
      ?.obsScenesCurrentChanged
  const [mutation] = useMutation<
    SwitchSceneFromSwitchesMutation,
    SwitchSceneFromSwitchesMutationVariables
  >(SWITCH)

  return (
    <>
      {list?.map((scene) => (
        <Switch
          key={scene}
          icon={faDisplay}
          onPress={() => mutation({ variables: { scene } })}
          pushed={scene == current}
          text={scene.replace('scene-', '')}
        />
      ))}
    </>
  )
}

export default Scenes
