import styled from '@emotion/styled'
import React, { ReactNode } from 'react'
import { CommonUserstate } from 'tmi.js'

const Emote = styled.img`
  height: 1em;
`

export const transformEmote = (
  text: string,
  emotes?: CommonUserstate['emotes'],
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
                    <Emote
                      src={`https://static-cdn.jtvnw.net/emoticons/v1/${replacement.id}/3.0`}
                    />,
                    v,
                  ],
            )
        }),
      [text] as ReactNode[],
    )
    .flat(2)
    .map((node, i) => <React.Fragment key={i}>{node}</React.Fragment>)
}
