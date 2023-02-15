import { gql, useSubscription } from '@apollo/client'
import { faPauseCircle, faPlayCircle } from '@fortawesome/free-solid-svg-icons'
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack'
import Switch from '../../../../components/Switch'
import {
  StreamStateEnum,
  StreamStateSubscription,
} from '../../../../gql/graphql'
import PrepareStart from './PrepareStart'
import { Props as SwitchProps } from '../../../../components/Switch'
import Pause from './Pause'
import { StyleSheet } from 'react-native'
import Stop from './Stop'

type Routes = {
  Button: undefined
  Start: undefined
  Pause: undefined
  Stop: undefined
}

const Stack = createNativeStackNavigator<Routes>()

export type StartButtonRouteProps = NativeStackScreenProps<Routes>

export const STREAM_STATE_SUBSCRIPTION = gql`
  subscription StreamState {
    streamStateChanged
  }
`

const getSwitchPropsFromState = (
  state: StreamStateEnum,
  props: StartButtonRouteProps,
): SwitchProps | undefined => {
  if (!state) return undefined
  switch (state) {
    case StreamStateEnum.Offline:
    case StreamStateEnum.Starting:
      return {
        icon: faPlayCircle,
        text: 'Start stream',
        onPress: () => props.navigation.navigate('Start'),
      }
    case StreamStateEnum.Streaming:
      return {
        icon: faPauseCircle,
        text: 'Pause stream',
        onPress: () => props.navigation.navigate('Pause'),
        onLongPress: () => props.navigation.navigate('Stop'),
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

const Button = (props: StartButtonRouteProps) => {
  const state = useSubscription<StreamStateSubscription>(
    STREAM_STATE_SUBSCRIPTION,
  )

  const switchProps = getSwitchPropsFromState(
    state.data?.streamStateChanged,
    props,
  )

  return <Switch {...switchProps}></Switch>
}

const StartButton = () => {
  return (
    <>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Button" component={Button} />
        <Stack.Group
          screenOptions={{ presentation: 'modal', headerShown: true }}
        >
          <Stack.Screen name="Start" component={PrepareStart} />
          <Stack.Screen name="Pause" component={Pause} />
          <Stack.Screen name="Stop" component={Stop} />
        </Stack.Group>
      </Stack.Navigator>
    </>
  )
}

export const styles = StyleSheet.create({
  nextButton: {
    height: 80,
  },
})

export default StartButton
