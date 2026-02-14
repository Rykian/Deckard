import { ComponentMeta, ComponentStory } from '@storybook/react-vite'
import { JSXElementConstructor, useState } from 'react'
import Music, { Track } from '.'
import colCover from './col.jpg'

export default {
  title: 'Music',
  component: Music,
} as ComponentMeta<typeof Music>

const Template: ComponentStory<typeof Music> = (args) => <Music {...args} />

const firstTrack: Track = {
  cover:
    'https://upload.wikimedia.org/wikipedia/en/3/3b/TheProdigy-TheFatOfTheLand.jpg',
  album: 'The Fat of the Land',
  artists: ['Prodigy', 'Shahin Badar'],
  name: 'Smack My Bitch Up',
  duration: 0,
}
const secondTrack: Track = {
  cover: colCover,
  album: 'Vertical',
  artists: ['Cult of Luna'],
  name: 'Vicarious Redemption',
  duration: 0,
}

export const Example = Template.bind({})
Example.args = {
  track: firstTrack,
}

export const Switching: ComponentStory<
  JSXElementConstructor<undefined>
> = () => {
  const [currentTrack, setCurrentTrack] = useState<
    typeof firstTrack | undefined
  >(firstTrack)
  const toggle = () =>
    setCurrentTrack(currentTrack == firstTrack ? secondTrack : firstTrack)
  return (
    <>
      <button onClick={toggle}>Toggle</button>
      <button onClick={() => setCurrentTrack(undefined)}>None</button>
      <Music track={currentTrack} />
    </>
  )
}

Switching.storyName = 'Switching between tracks'
