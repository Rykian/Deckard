import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { Card, Layout, Text } from '@ui-kitten/components'
import { ReactNode } from 'react'
import { GestureResponderEvent, StyleSheet } from 'react-native'

export interface Props {
  onPress?: (event: GestureResponderEvent) => void
  onLongPress?: (event: GestureResponderEvent) => void
  icon?: IconProp
  text?: string
  children?: ReactNode
  pushed?: boolean
}

const Switch = ({
  icon,
  text,
  children,
  onPress,
  onLongPress,
  pushed,
}: Props) => {
  return (
    <Card
      status={pushed ? 'info' : undefined}
      style={styles.card}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <Layout style={styles.cardContent}>
        {icon && <FontAwesomeIcon size={styles.icon.fontSize} icon={icon} />}
        {text && (
          <Text category="c2" style={styles.text}>
            {text}
          </Text>
        )}
        {children}
      </Layout>
    </Card>
  )
}

const styles = StyleSheet.create({
  card: {
    margin: 1,
    width: 130,
    height: 130,
  },
  cardContent: {
    width: 130,
    height: 130,
    position: 'absolute',
    justifyContent: 'space-evenly',
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
