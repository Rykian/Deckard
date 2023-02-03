/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { animated, useTransition } from '@react-spring/web'
import Message, { Props as MessageProps } from './Message'

interface Props {
  messages: MessageProps[]
}

const $container = css`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  margin: 0.2em;

  overflow-y: scroll;
  overscroll-behavior-y: contain;
  scroll-snap-type: y proximity;
  & .bottom {
    scroll-snap-align: end;
  }
`

const Chat = ({ messages }: Props) => {
  const transitions = useTransition(messages, {
    from: { opacity: 0, transform: 'rotateX(90deg)' },
    enter: { opacity: 1, transform: 'rotateX(0)' },
    leave: { opacity: 0 },
  })
  return (
    <div css={$container}>
      {transitions((style, message) => (
        <animated.div style={style}>
          <Message
            key={message.info.id}
            info={message.info}
            message={message.message}
          />
        </animated.div>
      ))}
      <span className="bottom"></span>
    </div>
  )
}
export default Chat
