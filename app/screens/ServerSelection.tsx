import { useAsyncStorage } from '@react-native-async-storage/async-storage'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import {
  Input,
  Layout,
  Select,
  Text,
  SelectItem,
  Button,
  IndexPath,
  Card,
} from '@ui-kitten/components'
import { useEffect, useState } from 'react'
import { StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import { RootStackParamList } from '../App'
import * as eva from '@eva-design/eva'

const PROTOCOLS = ['http://', 'https://']

type Props = NativeStackScreenProps<RootStackParamList, 'Server selection'>

const useServerHistory = () => {
  const storage = useAsyncStorage('backendHistory')
  const [history, setHistory] = useState<string[]>([])

  useEffect(() => {
    storage.getItem().then((result) => {
      const parsed = result ? JSON.parse(result) : undefined
      setHistory(parsed || [])
    })
  }, [])

  return {
    history,
    addHistory: (url: string) => {
      const updatedHistory = [...new Set([...history, url])]
      setHistory(updatedHistory)
      storage.setItem(JSON.stringify(updatedHistory))
    },
    removeHistory: (url: string) => {
      const updatedHistory = history.filter((v) => v != url)
      setHistory(updatedHistory)
      storage.setItem(JSON.stringify(updatedHistory))
    },
  }
}

const ServerSelectionScreen = (props: Props) => {
  const [protocol, setProtocol] = useState(new IndexPath(0))
  const [address, setAdress] = useState('')

  const { history, addHistory, removeHistory } = useServerHistory()

  return (
    <Layout
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          margin: 10,
        }}
      >
        <Layout style={styles.container} level="1">
          <Select
            style={{ ...styles.input, width: 120, flex: undefined }}
            label="Protocol"
            selectedIndex={protocol}
            onSelect={(index) => !Array.isArray(index) && setProtocol(index)}
            value={PROTOCOLS[protocol.row]}
          >
            {PROTOCOLS.map((protocol) => (
              <SelectItem title={protocol} key={protocol} />
            ))}
          </Select>
          <Input
            autoCapitalize="none"
            style={styles.input}
            label="Backend server adress and port"
            placeholder="localhost:3000"
            onChangeText={setAdress}
            value={address}
          />
        </Layout>
        <Layout
          style={{
            marginTop: 20,
            marginLeft: 'auto',
          }}
        >
          <Button
            onPress={() => {
              const url = PROTOCOLS[protocol.row] + address
              addHistory(url)
              props.navigation.navigate('Dashboard', { address: url })
            }}
          >
            <Text>Add & connect</Text>
          </Button>
        </Layout>
        <Layout style={{ width: '100%' }}>
          <Text
            category="c2"
            style={{ fontWeight: 'bold', color: eva.light['color-basic-600'] }}
          >
            History
          </Text>
          {history?.map((address) => (
            <Card key={address} style={{ maxWidth: 500 }}>
              <Layout style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text category="c2" style={{ flexGrow: 1 }}>
                  {address}
                </Text>
                <Button
                  appearance="ghost"
                  status="warning"
                  onPress={() => removeHistory(address)}
                >
                  Remove
                </Button>
                <Button
                  onPress={() =>
                    props.navigation.navigate('Dashboard', { address })
                  }
                >
                  Connect
                </Button>
              </Layout>
            </Card>
          ))}
        </Layout>
      </KeyboardAvoidingView>
    </Layout>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  input: {
    flex: 1,
    margin: 2,
  },
})

export default ServerSelectionScreen
