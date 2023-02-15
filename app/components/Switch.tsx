import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { Card, Text } from '@ui-kitten/components'
import { ReactNode } from 'react'
import { GestureResponderEvent, StyleSheet } from 'react-native'

export interface Props {
  onPress?: (event: GestureResponderEvent) => void
  onLongPress?: (event: GestureResponderEvent) => void
  icon?: IconProp
  text?: string
  children?: ReactNode
}

const Switch = ({ icon, text, children, onPress, onLongPress }: Props) => (
  <Card style={styles.card} onPress={onPress} onLongPress={onLongPress}>
    {icon && <FontAwesomeIcon size={styles.icon.fontSize} icon={icon} />}
    {text && (
      <Text category="c2" style={styles.text}>
        {text}
      </Text>
    )}
    {children}
  </Card>
)

const styles = StyleSheet.create({
  card: {
    width: 130,
    height: 130,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 70,
  },
  text: {
    textTransform: 'uppercase',
    textAlign: 'center',
    marginTop: 10,
  },
})

export default Switch
