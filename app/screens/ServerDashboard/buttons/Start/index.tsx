import { gql, useSubscription } from '@apollo/client'
import { faPauseCircle, faPlayCircle } from '@fortawesome/free-solid-svg-icons'
import Switch from '../../../../components/Switch'
import {
  StreamStateEnum,
  StreamStateSubscription,
} from '../../../../gql/graphql'
import { Props as SwitchProps } from '../../../../components/Switch'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { ServerDashboardStackParamList } from '../..'

export const STREAM_STATE_SUBSCRIPTION = gql`
  subscription StreamState {
    streamStateChanged
  }
`

const getSwitchPropsFromState = (
  state: StreamStateEnum | undefined | null,
  navigation: NavigationProp<ServerDashboardStackParamList>,
): SwitchProps | undefined => {
  if (!state) return undefined
  switch (state) {
    case StreamStateEnum.Offline:
    case StreamStateEnum.Starting:
      return {
        icon: faPlayCircle,
        text: 'Start stream',
        onPress: () => navigation.navigate('StartButton/Start'),
      }
    case StreamStateEnum.Streaming:
      return {
        icon: faPauseCircle,
        text: 'Pause stream',
        onPress: () => navigation.navigate('StartButton/Pause'),
        onLongPress: () => navigation.navigate('StartButton/Stop'),
      }
    case StreamStateEnum.Pausing:
      return {
        icon: faPlayCircle,
        text: 'Unpause',
        onPress: () => console.log('Unpause'),
      }
    case StreamStateEnum.Stopping:
      return {
        icon: faPlayCircle,
        text: 'Stopping',
      }
  }
}

const Button = () => {
  const navigation =
    useNavigation<NavigationProp<ServerDashboardStackParamList>>()
  const state = useSubscription<StreamStateSubscription>(
    STREAM_STATE_SUBSCRIPTION,
  )

  const switchProps = getSwitchPropsFromState(
    state.data?.streamStateChanged,
    navigation,
  )

  return <Switch {...switchProps}></Switch>
}

export default Button
