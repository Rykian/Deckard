import { gql, useSubscription } from '@apollo/client'
import { css, Interpolation, Theme } from '@emotion/react'
import { useSpring, animated, to } from '@react-spring/web'
import { parseISO } from 'date-fns'
import { ReactNode, useEffect, useState } from 'react'
import {
  CountdownUpdateSubscription,
  CountdownUpdateSubscriptionVariables,
  SceneChangingSubscription,
} from '../gql/graphql'
import MusicOverlay from '../overlays/Music'
import Countdown from './Countdown'

const $container = css`
  position: relative;
  color: white;
  height: 100vh;
  width: 100vw;
  & > * {
    position: absolute;
  }
  font-size: 30px;
  /* background-color: black; */
`

const $whiteBorder = css`
  height: 100%;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  clip-path: polygon(0 0, calc(60vw + 0.1em) 0, calc(50vw + 1em) 100%, 0 100%);
`

const $iframe = css`
  border: 0;
  height: 100vh;
  width: 150vw;
  margin-left: -50vw;
  clip-path: polygon(0 0, 110vw 0, 100vw 100%, 0 100%);
`

const $message = css`
  margin: 1em;
`
const $late = css`
  margin-top: 1em;
  font-size: 0.7em;
`

type Scenes = Record<
  string,
  {
    countdown?: Interpolation<Theme>
    late?: Interpolation<Theme>
    message?: Interpolation<Theme>
  }
>

type SceneNames = keyof Scenes

const scenes: Scenes = {
  campfire: {
    countdown: css`
      top: 5em;
      width: 50%;
      left: 0;
      right: 0;
    `,
  },
}

const COUNTDOWN = gql`
  subscription countdownUpdate($name: String!) {
    streamCountdownUpdated(name: $name)
  }
`

const SCENE_CHANGING = gql`
  subscription sceneChanging {
    obsScenesChanging {
      from
      to
    }
  }
`

interface Props {
  name: string
  sceneName: SceneNames
  lateMessages?: ReactNode | ReactNode[]
  message: ReactNode
}
const wait = (ms: number) =>
  new Promise<undefined>((resolve) => {
    setTimeout(() => resolve(undefined), ms)
  })

const FullScene = (props: Props) => {
  const countdownSub = useSubscription<
    CountdownUpdateSubscription,
    CountdownUpdateSubscriptionVariables
  >(COUNTDOWN, { variables: { name: props.name } })
  const sceneChangingSub =
    useSubscription<SceneChangingSubscription>(SCENE_CHANGING)
  const [active, setActive] = useState(false)

  useEffect(() => {
    setActive(
      sceneChangingSub.data
        ? sceneChangingSub.data?.obsScenesChanging.to.toLowerCase() ==
            props.name.toLowerCase()
        : true,
    )
  }, [sceneChangingSub.data?.obsScenesChanging.to, props.sceneName])

  const countdown = countdownSub.data
    ? parseISO(countdownSub.data?.streamCountdownUpdated)
    : undefined

  const sceneCSS = scenes[props.sceneName]

  const spring = useSpring({
    from: {
      whiteTop: 60,
      whiteBottom: 50,
      darkTop: 110,
      darkBottom: 100,
    },
  })

  const appear = async () => {
    await wait(500)
    spring.whiteTop.start(60)
    await wait(50)
    spring.darkTop.start(110)
    await wait(50)
    spring.darkBottom.start(100)
    await wait(50)
    spring.whiteBottom.start(50)
  }
  const disappear = async () => {
    spring.whiteBottom.start(0)
    await wait(50)
    spring.darkBottom.start(0)
    await wait(50)
    spring.darkTop.start(0)
    await wait(50)
    spring.whiteTop.start(0)
  }

  useEffect(() => {
    if (active) {
      appear()
    } else {
      disappear()
    }
  }, [active])

  return (
    <div css={$container}>
      <animated.div
        css={$whiteBorder}
        style={{
          clipPath: to(
            [spring.whiteTop, spring.whiteBottom],
            (whiteTop, whiteBottom) =>
              `polygon(0 0, calc(${whiteTop}vw + 0.1em) 0, calc(${whiteBottom}vw + 1em) 100%, 0 100%)`,
          ),
        }}
      >
        <animated.iframe
          css={$iframe}
          style={{
            clipPath: to(
              [spring.darkTop, spring.darkBottom],
              (darkTop, darkBottom) =>
                `polygon(0 0, ${darkTop}vw 0, ${darkBottom}vw 100%, 0 100%)`,
            ),
          }}
          src={`/scenes/${props.sceneName}/index.html`}
        />
      </animated.div>
      <div css={sceneCSS.countdown}>
        {countdown && (
          <Countdown
            target={countdown}
            lateAfter={60}
            late={props.lateMessages}
            lateCSS={[$late, sceneCSS.late]}
          />
        )}
      </div>
      <div css={[$message, sceneCSS.message]}>{props.message}</div>
      <div
        css={css`
          right: 0;
          transform: scale(75%);
        `}
      >
        <MusicOverlay />
      </div>
    </div>
  )
}

export default FullScene
