import { faPlay, faPlayCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { Card, Icon, Text } from '@ui-kitten/components'
import { StyleSheet } from 'react-native'

const Switch = () => {
  return (
    <Card style={styles.card}>
      <FontAwesomeIcon
        size={styles.icon.fontSize}
        icon={faPlayCircle}
      />
      <Text
        category="c2"
        style={{
          textTransform: 'uppercase',
          textAlign: 'center',
          marginTop: 10,
        }}
      >
        Start stream
      </Text>
    </Card>
  )
}

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
})

export default Switch
