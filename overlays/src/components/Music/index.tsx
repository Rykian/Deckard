/** @jsxImportSource @emotion/react */
import { ThemeProvider } from '@emotion/react'
import { useEffect, useRef, useState } from 'react'
import { getColors } from './colors'
import {
  $album,
  $artists,
  $container,
  $image,
  $infos,
  $name,
  $progress,
} from './styles'
import { animated, useSpring, config } from '@react-spring/web'

export interface Track {
  /** Cover art image */
  cover: string
  /** Song name */
  name: string
  /** Album name */
  album: string
  /** Artists names */
  artists: string[]
  /** Track duration in ms */
  duration: number
}

interface Props {
  track?: Track
  progress?: number
}

export type Colors = Partial<{
  primaryColor: string
  secondaryColor: string
  tercaryColor: string
}>

const arrayFormater = new Intl.ListFormat('en', { style: 'long' })

const Progress = (props: { progress: number; duration: number }) => {
  const [progress, setProgress] = useState(props.progress)

  useEffect(() => setProgress(props.progress), [props.progress])

  useEffect(() => {
    const interval = setTimeout(() => setProgress(progress + 1000), 1000)
    return () => clearInterval(interval)
  }, [progress])

  return (
    <div
      css={$progress}
      style={{
        width: `calc(${progress / props.duration} * var(--max-width))`,
      }}
    ></div>
  )
}

const Music = ({ track: nextData, progress }: Props) => {
  const [colors, setColors] = useState<Colors>()
  const [track, setTrack] = useState<Track>()
  const imgRef = useRef<HTMLImageElement>(null)

  const imageSpring = useSpring({
    from: { opacity: 0 },
  })

  const infoSpring = useSpring({
    from: { marginLeft: '-30em' },
    options: config.molasses,
  })

  const hide = async () => {
    await infoSpring.marginLeft.start('-40em')
    await imageSpring.opacity.start(0)
  }

  const onLoad = async () => {
    if (!imgRef.current) return

    const palette = getColors(imgRef.current)
    setColors(palette)
    await imageSpring.opacity.start(1)
    await infoSpring.marginLeft.start('-10em', {
      config: config.wobbly,
    })
  }

  useEffect(() => {
    ;(async () => {
      await hide()
      setTrack(nextData)

      // When the image src attribute is the same, onLoad event isn't
      // dispatched, so we're simulating the dispatch
      if (nextData && track?.cover == nextData?.cover) onLoad()
    })()
  }, [nextData])

  return track ? (
    <ThemeProvider theme={colors || {}}>
      <div css={$container}>
        <animated.img
          onLoad={onLoad}
          css={$image}
          style={imageSpring}
          src={track.cover}
          ref={imgRef}
          crossOrigin="anonymous"
        />
        <animated.div css={$infos} style={infoSpring}>
          <div css={$name}>{track.name}</div>
          <div css={$album}>{track.album}</div>
          <div css={$artists}>{arrayFormater.format(track.artists)}</div>
          {progress && (
            <Progress duration={track.duration} progress={progress} />
          )}
        </animated.div>
      </div>
    </ThemeProvider>
  ) : (
    <></>
  )
}

export default Music
