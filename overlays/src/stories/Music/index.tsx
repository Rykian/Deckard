/** @jsxImportSource @emotion/react */
import { css, ThemeProvider } from '@emotion/react'
import { ReactEventHandler, useEffect, useRef, useState } from 'react'
import { getColors } from './colors'
import { $album, $artists, $container, $image, $infos, $name } from './styles'
import { animated, useSpring, config } from '@react-spring/web'

interface Props {
  track?: {
    /** Cover art image */
    cover: string
    /** Song name */
    name: string
    /** Album name */
    album: string
    /** Artists names */
    artists: string[]
  }
}

export type Colors = Partial<{
  primaryColor: string
  secondaryColor: string
  tercaryColor: string
}>

const arrayFormater = new Intl.ListFormat('en', { style: 'long' })

const Music = ({ track: nextData }: Props) => {
  const [colors, setColors] = useState<Colors>()
  const [track, setTrack] = useState<Props['track']>(nextData)

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

  useEffect(() => {
    if (!nextData) {
      hide().then(() => setTrack(undefined))
      return
    }

    // Preloading next image
    const image = new Image()
    image.src = nextData.cover
    image.crossOrigin = 'anonymous'

    // When image is loaded, remove current image, get palette of next image
    image.onload = async (event) => {
      if (nextData != track) await hide()
      const palette = getColors(event.target as HTMLImageElement)

      setColors(palette)
      setTrack(nextData)
    }
  }, [nextData])

  return (
    track ? (
      <ThemeProvider theme={colors || {}}>
        <div css={$container}>
          <animated.img
            onLoad={async () => {
              await imageSpring.opacity.start(1)
              await infoSpring.marginLeft.start('-10em', {
                config: config.wobbly,
              })
            }}
            css={$image}
            style={imageSpring}
            src={track.cover}
            crossOrigin="anonymous"
          />
          <animated.div css={$infos} style={infoSpring}>
            <div css={$name}>{track.name}</div>
            <div css={$album}>{track.album}</div>
            <div css={$artists}>{arrayFormater.format(track.artists)}</div>
          </animated.div>
        </div>
      </ThemeProvider>
    ) : <></>
  )
}

export default Music
