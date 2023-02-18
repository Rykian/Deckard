/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { animated, useTransition } from '@react-spring/web'
import React, { useEffect, useRef } from 'react'
import { ChatUserstate } from 'tmi.js'
import { transformEmote } from './transformEmotes'

export interface Message {
  text: string
  info: ChatUserstate
}

interface Props {
  messages: Message[]
  useUsernameColor: (username: string) => string
}

const $container = css`
  max-height: 100vh;
  width: 100vw;
  margin: 0.2em;
  padding-top: 100vh;

  overflow-y: scroll;
  display: grid;
  grid-template-columns: min-content auto;
`

const $username = css`
  max-width: 8em;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: right;
  white-space: nowrap;
  &:after {
    content: ':';
  }
`

interface UsernameProps {
  displayName?: string
  username: string
  useUsernameColor: (username: string) => string
}

const Username = (props: UsernameProps) => {
  const color = props.useUsernameColor(props.username)
  return (
    <div
      css={[
        $username,
        css`
          color: ${color};
        `,
      ]}
    >
      {props.displayName ?? props.username}
    </div>
  )
}

const Chat = ({ messages, useUsernameColor }: Props) => {
  const transitions = useTransition(messages, {
    from: {
      opacity: 0,
      // transform: 'rotateX(90deg)',
    },
    enter: {
      opacity: 1,
      // transform: 'rotateX(0)',
    },
    leave: { opacity: 0 },
  })
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    ref.current.scrollIntoView({
      behavior: 'smooth',
    })
  }, [ref, messages])

  return (
    <div css={$container}>
      {transitions((style, { info, text }) => {
        const emoted = transformEmote(text, info.emotes)

        return (
          <React.Fragment key={info.id}>
            <animated.div style={style}>
              {info.username && (
                <Username
                  username={info.username}
                  displayName={info['display-name']}
                  useUsernameColor={useUsernameColor}
                />
              )}
            </animated.div>
            <animated.div style={style}>
              <div
                css={css`
                  padding-left: 0.2em;
                `}
              >
                {emoted}
              </div>
            </animated.div>
          </React.Fragment>
        )
      })}
      <div ref={ref} />
    </div>
  )
}
export default Chat
