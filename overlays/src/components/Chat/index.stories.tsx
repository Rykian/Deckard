/** @jsxImportSource @emotion/react */
import { useState } from 'react'
import { v4 as uuid } from 'uuid'
import Chat, { Message } from '.'
import { css } from '@emotion/react'

export default {
  title: 'Chat/Chat',
  component: Chat,
}

const message: Message = {
  text: 'naowhClap qsdqsdds naowhClap',
  info: {
    badges: { broadcaster: '1' },
    'client-nonce': '5052af153cf10608d0e2b588301c711e',
    color: undefined,
    'display-name': 'Rykian',
    emotes: { '300065297': ['0-8', '19-27'] },
    'first-msg': false,
    flags: undefined,
    id: '1023d1ce-a4ce-484d-be15-25969d17f007',
    mod: false,
    'returning-chatter': false,
    'room-id': '150906071',
    subscriber: false,
    'tmi-sent-ts': '1675424675697',
    turbo: false,
    'user-id': '150906071',
    'user-type': undefined,
    'emotes-raw': '300065297:0-8,19-27',
    'badge-info-raw': undefined,
    'badges-raw': 'broadcaster/1',
    username: 'rykian',
    'message-type': 'chat',
  },
}

function selectColor(colorNum: number, colors: number) {
  if (colors < 1) colors = 1 // defaults to one color - avoid divide by zero
  return 'hsl(' + ((colorNum * (360 / colors)) % 360) + ',100%,50%)'
}

const colors: Record<string, string> = {}

const getColor = (name: string) => {
  if (!name) return 'green'

  if (!colors[name])
    colors[name] = selectColor(Math.floor(Math.random() * 40), 40)

  return colors[name]
}

export const Example = () => {
  const [messages, setMessages] = useState<Message[]>([message])

  return (
    <div
      css={css`
        max-height: 200px;
      `}
    >
      <button
        onClick={() => {
          const id = uuid()
          const displayName =
            Math.random() > 0.5
              ? 'Bla'
              : 'Blibliblbibliblbibliblbibliblbibliblbi'
          setMessages([
            ...messages,
            {
              text: id,
              info: {
                ...message.info,
                id,
                emotes: undefined,
                'display-name': displayName,
              },
            },
          ])
        }}
      >
        Add message
      </button>
      <Chat messages={messages} useUsernameColor={getColor} />
    </div>
  )
}
