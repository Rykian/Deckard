import { gql, useSubscription } from '@apollo/client'
import { useEffect, useState } from 'react'
import { SceneChangingSubscription } from '../../gql/graphql'

const SCENE_CHANGING = gql`
  subscription sceneChanging {
    obsScenesChanging {
      from
      to
    }
  }
`

/**
 * Determine if the scene is visible in OBS by using backend to watch scene
 * change from there or fallback to JS API injected by OBS-Browser
 *
 * @param obsScene name of the scene in OBS
 * @returns true if scene is currently displayed in OBS
 */
const useIsActive = (obsScene: string) => {
  const [active, setActive] = useState<boolean>()

  const sceneChangingSub =
    useSubscription<SceneChangingSubscription>(SCENE_CHANGING)

  useEffect(() => {
    if (!sceneChangingSub.data) return

    setActive(
      sceneChangingSub.data.obsScenesChanging.to.toLowerCase() ==
        obsScene.toLowerCase(),
    )
  }, [sceneChangingSub.data?.obsScenesChanging.to, obsScene])

  // Handle scene change from OBS
  useEffect(() => {
    if (!window.obsstudio) return

    window.obsstudio.getCurrentScene((scene) =>
      setActive(obsScene == scene.name.toLowerCase()),
    )

    window.addEventListener('obsSourceVisibleChanged', (e) =>
      setActive(e.detail.visible),
    )
  }, [])

  return active
}

export default useIsActive
