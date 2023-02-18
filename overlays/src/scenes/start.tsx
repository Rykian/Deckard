import { gql, useSubscription } from '@apollo/client'
import { css, Interpolation, Theme } from '@emotion/react'
import { parseISO } from 'date-fns'
import {
  CountdownUpdateSubscription,
  CountdownUpdateSubscriptionVariables,
} from '../gql/graphql'
import MusicOverlay from '../overlays/Music'
import Countdown from '../components/Countdown'

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

const $iframe = css`
  opacity: 0.95;
  border: 0;
  height: 100vh;
  width: 50vw;
`

const $countdown = css`
  /* text-shadow: -${1}px -${1}px 0 #000,
    ${1}px -${1}px 0 #000,
    -${1}px ${1}px 0 #000,
    ${1}px ${1}px 0 #000; */
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
      bottom: 5em;
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

const Start = () => {
  const countdownSub = useSubscription<
    CountdownUpdateSubscription,
    CountdownUpdateSubscriptionVariables
  >(COUNTDOWN, { variables: { name: 'start' } })

  const countdown = countdownSub.data
    ? parseISO(countdownSub.data?.streamCountdownUpdated)
    : undefined

  const lateMessages = [
    'Oops...',
    "J'arrive bientôt, promis !",
    "J'ai dû oublier un truc sur le feu.",
    "C'est où déjà le bouton pour commencer ?",
    "C'est quoi déjà le numéro des secours ?",
    'Alerte enlèvement : un barbu a disparu.',
    'Tant pis hein. Amusez-vous sans moi !',
  ]
  const message = `J'arrive bientôt !`
  const scene: SceneNames = 'campfire'
  const sceneCSS = scenes[scene]

  return (
    <div css={$container}>
      <iframe css={$iframe} src={`/scenes/${scene}/index.html`} />
      <div css={[$countdown, sceneCSS.countdown]}>
        {countdown && (
          <Countdown
            target={countdown}
            lateAfter={60}
            late={lateMessages}
            lateCSS={[$late, sceneCSS.late]}
          />
        )}
      </div>
      <div css={[$message, sceneCSS.message]}>{message}</div>
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

export default Start
