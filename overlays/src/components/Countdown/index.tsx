import { css, Interpolation, Theme } from '@emotion/react'
import { useTransition } from '@react-spring/web'
import { differenceInSeconds } from 'date-fns'
import React, { ReactNode, useEffect, useState } from 'react'
import { animated, config, Transition } from '@react-spring/web'

type Props = {
  /** Text displayed when counter is overdue */
  late?: React.ReactNode | React.ReactNode[]
  /** Overdue configuration in seconds */
  lateAfter: number
  /** time when counter will hit 0 */
  target: Date
  css?: Interpolation<Theme>
  lateCSS: Interpolation<Theme>
}

const $container = css`
  display: grid;
  width: 100%;
`

const $counterContainer = css`
  display: flex;
  font-family: Ubuntu Mono;
  justify-content: center;
  margin-bottom: 1em;
`

const $numberContainer = css`
  position: relative;
  visibility: hidden;
`

const $numberDisplay = css`
  position: absolute;
  visibility: visible;
`

const LateMessage = (props: {
  late: ReactNode | ReactNode[]
  changeEvery: number
  css?: Interpolation<Theme>
}) => {
  const [currentMessage, setCurrentMessage] = useState<React.ReactNode>(() => {
    if (Array.isArray(props.late)) return props.late[0]
    else return props.late
  })

  // Message rotation
  useEffect(() => {
    if (!Array.isArray(props.late)) return
    const messages = props.late
    let currentIndex = 0
    let timeout: NodeJS.Timeout

    const setNextMessage = () => {
      const nextIndex = messages[currentIndex + 1] && currentIndex + 1
      if (!nextIndex) return

      setCurrentMessage(messages[nextIndex])
      currentIndex = nextIndex
      timeout = setTimeout(
        setNextMessage,
        props.changeEvery * 1_000 * nextIndex,
      )
    }

    timeout = setTimeout(setNextMessage, props.changeEvery * 1_000)

    return () => clearTimeout(timeout)
  }, [props.changeEvery, props.late])

  const transition = useTransition(currentMessage, {
    from: { opacity: 0, x: '2em' },
    enter: { opacity: 1, x: '0' },
    leave: { opacity: 0, x: '-2em' },
    config: config.wobbly,
  })

  return (
    <div css={props.css}>
      {transition((style, item) => (
        <animated.div
          css={css`
            position: absolute;
            text-align: center;
            left: 0;
            right: 0;
          `}
          style={style}
        >
          {item}
        </animated.div>
      ))}
    </div>
  )
}

LateMessage.defaultProps = { changeEvery: 2 }

const Countdown = (props: Props) => {
  const [remaining, setRemaining] = useState<number>()
  const [countdownInterval, setCountdownInterval] = useState<NodeJS.Timer>()
  const [lateDisplay, setLateDisplay] = useState<Props['late']>()

  // Counter refresher initialization
  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(differenceInSeconds(props.target, new Date()))
    }, 1000)
    setCountdownInterval(interval)

    return () => clearInterval(interval)
  }, [props.target])

  // Handling counter end and late display
  useEffect(() => {
    if (typeof remaining == 'undefined' || remaining > 0) return

    clearInterval(countdownInterval as unknown as number)
    setTimeout(() => {
      setLateDisplay(props.late)
    }, props.lateAfter * 1000)
  }, [countdownInterval, remaining])

  if (typeof remaining == 'undefined') return null

  const minutes = Math.floor(remaining / 60)
  const seconds = remaining % 60

  const display = `${minutes}:${seconds.toString().padStart(2, '0')}`.split('')

  return (
    <div css={$container}>
      <div css={$counterContainer}>
        {display.map((item, i) => (
          <div key={i} css={$numberContainer}>
            {/* Keep the space of each char on the counter */}.
            <Transition
              items={item}
              from={{ opacity: 0, y: '-1em' }}
              leave={{ opacity: 0, y: '1em' }}
              enter={{ opacity: 1, y: '0em' }}
              delay={100}
            >
              {(styles, item) => (
                <animated.div css={$numberDisplay} style={styles}>
                  {item}
                </animated.div>
              )}
            </Transition>
          </div>
        ))}
      </div>
      {lateDisplay && (
        <LateMessage
          css={props.lateCSS}
          late={props.late}
          changeEvery={props.lateAfter}
        />
      )}
    </div>
  )
}

Countdown.defaultProps = {
  lateAfter: 10,
} as Partial<Props>

export default Countdown
