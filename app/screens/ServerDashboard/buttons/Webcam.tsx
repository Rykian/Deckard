import { gql, useMutation, useSubscription } from '@apollo/client'
import { faCamera } from '@fortawesome/free-solid-svg-icons'
import Switch from '../../../components/Switch'
import {
  CameraBlurChangedSubscription,
  CameraVisibilityChangedSubscription,
} from '../../../gql/graphql'

const TOGGLE = gql`
  mutation ToggleCameraVisibility {
    streamWebcamToggle
  }
`

const TOGGLE_BLUR = gql`
  mutation ToggleCameraBlur {
    streamWebcamToggleBlur
  }
`

const VISIBILITY = gql`
  subscription CameraVisibilityChanged {
    streamWebcamChanged
  }
`

const BLUR = gql`
  subscription CameraBlurChanged {
    streamWebcamBlurChanged
  }
`

const Webcam = () => {
  const [toggle] = useMutation(TOGGLE)
  const [blur] = useMutation(TOGGLE_BLUR)
  const visible =
    useSubscription<CameraVisibilityChangedSubscription>(VISIBILITY).data
      ?.streamWebcamChanged

  const blurred =
    useSubscription<CameraBlurChangedSubscription>(BLUR).data
      ?.streamWebcamBlurChanged

  return (
    <Switch
      icon={faCamera}
      onPress={() => toggle()}
      onLongPress={() => blur()}
      text={visible ? (blurred ? 'blurred' : 'visible') : 'hidden'}
      pushed={visible}
    />
  )
}

export default Webcam
