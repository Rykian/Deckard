import { gql, useMutation, useSubscription } from '@apollo/client'
import { faCamera } from '@fortawesome/free-solid-svg-icons'
import Switch from '../../../components/Switch'
import { CameraVisibilityChangedSubscription } from '../../../gql/graphql'

const TOGGLE = gql`
  mutation ToggleCameraVisibility {
    streamWebcamToggle
  }
`

const VISIBILITY = gql`
  subscription CameraVisibilityChanged {
    streamWebcamChanged
  }
`

const Webcam = () => {
  const [toggle] = useMutation(TOGGLE)
  const visible =
    useSubscription<CameraVisibilityChangedSubscription>(VISIBILITY).data
      ?.streamWebcamChanged

  return (
    <Switch
      icon={faCamera}
      onPress={() => toggle()}
      text={visible ? 'visible' : 'hidden'}
      pushed={visible}
    />
  )
}

export default Webcam
