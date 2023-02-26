import { gql, useSubscription } from '@apollo/client'
import { css, Interpolation, Theme } from '@emotion/react'
import styled from '@emotion/styled'
import { parseISO } from 'date-fns'
import { ReactNode } from 'react'
import {
  CountdownUpdateSubscription,
  CountdownUpdateSubscriptionVariables,
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
`

const WhiteBorder = styled.div`
  height: 100%;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  clip-path: polygon(0 0, calc(60vw + 0.1em) 0, calc(50vw + 1em) 100%, 0 100%);
`

const $iframe = css`
  /* opacity: 0.95; */
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

interface Props {
  name: string
  sceneName: SceneNames
  lateMessages?: ReactNode | ReactNode[]
  message: ReactNode
}

const FullScene = (props: Props) => {
  const countdownSub = useSubscription<
    CountdownUpdateSubscription,
    CountdownUpdateSubscriptionVariables
  >(COUNTDOWN, { variables: { name: props.name } })

  const countdown = countdownSub.data
    ? parseISO(countdownSub.data?.streamCountdownUpdated)
    : undefined

  const sceneCSS = scenes[props.sceneName]
  return (
    <div css={$container}>
      <WhiteBorder>
        <iframe css={$iframe} src={`/scenes/${props.sceneName}/index.html`} />
      </WhiteBorder>
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
