import {
  FontAwesomeIcon,
  Props as FontAwesomeIconProps,
} from '@fortawesome/react-native-fontawesome'
import { Button, ButtonProps } from '@ui-kitten/components'

interface Props {
  children: ButtonProps['children']
  onPress: ButtonProps['onPress']
  icon: FontAwesomeIconProps['icon']
  connected: boolean
}

const ConnectionState = (props: Props) => {
  return (
    <Button
      status={!props.connected ? 'disabled' : undefined}
      size="tiny"
      onPress={props.onPress}
      style={{ marginLeft: 5 }}
      accessoryLeft={(aProps) => (
        <FontAwesomeIcon
          style={aProps?.style ?? undefined}
          color={(aProps?.style as any)?.tintColor}
          icon={props.icon}
        />
      )}
    >
      {props.children}
    </Button>
  )
}

export default ConnectionState
