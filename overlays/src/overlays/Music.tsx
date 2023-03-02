import { gql, useSubscription } from '@apollo/client'
import { useMemo } from 'react'
import {
  CurrentTrackProgressSubscription,
  CurrentTrackSubscription,
} from '../gql/graphql'
import Music from '../components/Music'

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
      duration
    }
  }
`
const PROGRESS = gql`
  subscription currentTrackProgress {
    currentTrackProgress
  }
`

const MusicOverlay = () => {
  const currentTrackSubscription =
    useSubscription<CurrentTrackSubscription>(CURRENT_TRACK)
  const trackData = currentTrackSubscription.data?.currentTrackUpdated
  const progress =
    useSubscription<CurrentTrackProgressSubscription>(PROGRESS).data
      ?.currentTrackProgress || undefined

  const track = useMemo(
    () =>
      trackData
        ? {
            cover: trackData.cover,
            name: trackData.name,
            album: trackData.album,
            artists: trackData.artists,
            duration: trackData.duration,
          }
        : undefined,
    [currentTrackSubscription.data],
  )
  return <Music track={track} progress={progress} />
}

export default MusicOverlay
