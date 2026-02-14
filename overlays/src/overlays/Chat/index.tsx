import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import { StoreProvider } from 'easy-peasy'
import { useEffect } from 'react'
import { Client } from 'tmi.js'
import { TwitchInfosQuery } from '../../gql/graphql'
import Chat from '../../components/Chat'
import store, { useStoreActions, useStoreState } from './store'
import { milliseconds } from 'date-fns'

const CLIENT_ID = gql`
  query TwitchInfos {
    twitchGetClientId
    getTwitchUserName
  }
`

interface Props {
  /** Expiration in minutes */
  messageExpirationTimeout?: number
}

const ChatOverlay = ({ messageExpirationTimeout = 5 }: Props) => {
  const messages = useStoreState((s) => s.messages)
  const add = useStoreActions((a) => a.add)
  const remove = useStoreActions((a) => a.delete)

  const clientIdQuery = useQuery<TwitchInfosQuery>(CLIENT_ID)
  const clientId = clientIdQuery.data?.twitchGetClientId
  const username = clientIdQuery.data?.getTwitchUserName

  useEffect(() => {
    if (!clientId || !username) return

    const client = new Client({ channels: [username], options: { clientId } })
    client.on('message', (_channel, info, text) => {
      add({ info, text })
      messageExpirationTimeout > 0 &&
        setTimeout(() => {
          console.log('removing message', info.id)
          info.id && remove(info.id)
        }, milliseconds({ minutes: messageExpirationTimeout }))
    })
    client.on('messagedeleted', (_channel, _user, _message, info) => {
      info['target-msg-id'] && remove(info['target-msg-id'])
    })
    client.connect()

    return () => {
      client.removeAllListeners()
      client.disconnect()
    }
  }, [username, clientId])

  return (
    <Chat
      messages={messages}
      useUsernameColor={(username) => useStoreState((s) => s.colors[username])}
    />
  )
}

export default (props: Props) => (
  <StoreProvider store={store}>
    <ChatOverlay {...props} />
  </StoreProvider>
)
