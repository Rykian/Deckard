import { gql, useSubscription } from '@apollo/client'
import { useMemo } from 'react'
import { CurrentTrackSubscription } from '../gql/graphql'
import Music from '../stories/Music'

const CURRENT_TRACK = gql`
  subscription currentTrack {
    currentTrackUpdated {
      id
      artists
      album
      name
      release
      cover
      url
    }
  }
`

const MusicOverlay = () => {
  const currentTrackSubscription =
    useSubscription<CurrentTrackSubscription>(CURRENT_TRACK)
  const trackData = currentTrackSubscription.data?.currentTrackUpdated

  const track = useMemo(
    () =>
      trackData
        ? {
            cover: trackData.cover,
            name: trackData.name,
            album: trackData.album,
            artists: trackData.artists,
          }
        : undefined,
    [currentTrackSubscription.data]
  )
  return <Music track={track} />
}

export default MusicOverlay
