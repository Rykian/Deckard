/** @jsxImportSource @emotion/react */
import React, { ReactNode } from 'react'
import { ChatUserstate, CommonUserstate } from 'tmi.js'
import { css } from '@emotion/react'
import styled from '@emotion/styled'

export interface Props {
  message: string
  info: ChatUserstate
}

const $emote = css`
  height: 1em;
`

const transformEmote = (
  text: string,
  emotes?: CommonUserstate['emotes']
): ReactNode => {
  if (!emotes) return text

  const replacements = Object.entries(emotes).map(([id, positions]) => {
    const [start, end] = positions[0].split('-').map((t) => parseInt(t))

    return {
      key: text.substring(start, end + 1),
      id,
    }
  })

  return replacements
    .reduce(
      (acc, replacement) =>
        acc.map((node) => {
          if (typeof node !== 'string') return node

          return node
            .split(replacement.key)
            .map((v, i) =>
              i == 0
                ? v
                : [
                    <img
                      src={`https://static-cdn.jtvnw.net/emoticons/v1/${replacement.id}/3.0`}
                      css={$emote}
                    />,
                    v,
                  ]
            )
        }),
      [text] as ReactNode[]
    )
    .flat(2)
    .map((node, i) => <React.Fragment key={i}>{node}</React.Fragment>)
}

const $container = css`
  display: flex;
  width: fit-content;
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 4px;
  padding: 2px;
  margin-top: 1px;
`

const $username = css`
  display: flex;
  &:after {
    content: ':';
  }
`

const $content = css`
  padding-left: 0.2em;
  color: white;
`

const Message = React.memo(({ info, message }: Props) => {
  const emoted = transformEmote(message, info.emotes)

  return (
    <div css={$container}>
      <div
        css={[
          $username,
          css`
            color: ${info.color || 'rgb(0, 123, 0)'};
          `,
        ]}
      >
        {info['display-name']}
      </div>
      <div css={$content}>{emoted}</div>
    </div>
  )
})

export default Message
