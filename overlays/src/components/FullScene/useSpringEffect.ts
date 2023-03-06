import { useSpring } from '@react-spring/web'
import { useEffect, useState } from 'react'

const wait = (ms: number) =>
  new Promise<undefined>((resolve) => {
    setTimeout(() => resolve(undefined), ms)
  })

type EffectProperties = 'whiteTop' | 'whiteBottom' | 'darkTop' | 'darkBottom'
const effects: [
  property: EffectProperties,
  deployed: number,
  closed: number,
][] = [
  ['whiteTop', 60, 0],
  ['darkTop', 110, 0],
  ['darkBottom', 100, 0],
  ['whiteBottom', 50, 0],
]
const reversedEffects = [...effects].reverse()
const from = effects.reduce((acc, [property, _deployed, closed]) => {
  acc[property] = closed
  return acc
}, {} as Record<EffectProperties, number>)

const useSpringEffect = (active?: boolean) => {
  const spring = useSpring({ from })
  const [cancel] = useState({ appear: true, disappear: true })

  const appear = async () => {
    cancel.appear = false
    cancel.disappear = true
    // RESET
    effects.forEach(([property, _, closed]) => {
      spring[property].stop()
      spring[property].set(closed)
    })
    await wait(500)
    for (const [property, deployed] of effects) {
      if (cancel.appear) return

      spring[property].stop()
      spring[property].start(deployed)
      await wait(50)
    }
  }

  const disappear = async () => {
    cancel.appear = true
    cancel.disappear = false
    // RESET
    effects.forEach(([property, deployed]) => {
      spring[property].stop()
      spring[property].set(deployed)
    })

    for (const [property, _, closed] of reversedEffects) {
      if (cancel.disappear) return

      spring[property].stop()
      spring[property].start(closed)
      await wait(50)
    }
  }

  useEffect(() => {
    active ? appear() : disappear()
  }, [active])

  return spring
}

export default useSpringEffect
