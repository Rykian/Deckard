import { ComponentMeta, ComponentStory } from '@storybook/react'
import { ChatUserstate } from 'tmi.js'
import Message from './Message'

export default {
  title: 'Chat/Message',
  component: Message,
} as ComponentMeta<typeof Message>

const message = 'naowhClap qsdqsdds naowhClap'
const messageInfo: ChatUserstate = {
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
}

const Template: ComponentStory<typeof Message> = (args) => <Message {...args} />

export const Example = Template.bind({})
Example.args = {
  message,
  info: messageInfo,
}
