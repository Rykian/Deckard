import { gql, useQuery } from '@apollo/client'
import { Reducer, useEffect, useReducer } from 'react'
import { Client } from 'tmi.js'
import { TwitchInfosQuery } from '../gql/graphql'
import Chat from '../stories/Chat'
import { Props as Message } from '../stories/Chat/Message'

const CLIENT_ID = gql`
  query TwitchInfos {
    twitchGetClientId
    getTwitchUserName
  }
`

interface State {
  messages: Message[]
}

type Actions =
  | { type: 'add'; message: Message }
  | { type: 'delete'; messageId: string }

const reducer: Reducer<State, Actions> = (state, action) => {
  switch (action.type) {
    case 'add':
      return { ...state, messages: [...state.messages, action.message] }
    case 'delete':
      return {
        ...state,
        messages: state.messages.filter(
          (message) => message.info.id != action.messageId
        ),
      }
  }
  return state
}

interface Props {
  messageExpirationTimeout?: number
}

const ChatOverlay = ({messageExpirationTimeout = 5}: Props) => {
  const [state, dispatch] = useReducer(reducer, { messages: [] })
  const clientIdQuery = useQuery<TwitchInfosQuery>(CLIENT_ID)
  const clientId = clientIdQuery.data?.twitchGetClientId
  const username = clientIdQuery.data?.getTwitchUserName

  useEffect(() => {
    if (!clientId || !username) return
    console.log('Chat initialization')

    const client = new Client({ channels: [username], options: { clientId } })
    client.on('message', (_channel, info, message) => {
      console.log('onmessage', message, info)
      dispatch({ type: 'add', message: { info, message } })
      messageExpirationTimeout > 0 && setTimeout(
        () => info.id && dispatch({ type: 'delete', messageId: info.id }),
        messageExpirationTimeout * 60 * 1_000
      )
    })
    client.on('messagedeleted', (_channel, _user, _message, info) => {
      info['target-msg-id'] &&
        dispatch({ type: 'delete', messageId: info['target-msg-id'] })
    })
    client.connect()

    return () => {
      client.removeAllListeners()
      client.disconnect()
    }
  }, [username, clientId])

  return <Chat messages={state.messages} />
}

export default ChatOverlay
