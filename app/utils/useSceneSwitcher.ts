import { gql, useMutation } from '@apollo/client'
import { MutationObsScenesSwitchArgs } from '../gql/graphql'

const SWITCH_SCENE = gql`
  mutation SwitchScene($scene: String!, $instant: Boolean) {
    obsScenesSwitch(scene: $scene, instant: $instant)
  }
`
const useSceneSwitcher = () => {
  const [switchScene] = useMutation<boolean, MutationObsScenesSwitchArgs>(
    SWITCH_SCENE,
  )
  return switchScene
}

export default useSceneSwitcher
