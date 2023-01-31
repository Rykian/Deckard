import { faChromecast, IconDefinition } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon, Props as FontAwesomeIconProps } from '@fortawesome/react-native-fontawesome'
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
      status={!props.connected ? "disabled" : undefined}
      size="tiny"
      onPress={props.onPress}
      accessoryLeft={(aProps) => (
        <FontAwesomeIcon
          style={aProps.style}
          color={aProps.style['tintColor']}
          icon={props.icon}
        />
      )}
    >
      {props.children}
    </Button>
  )
}

export default ConnectionState
