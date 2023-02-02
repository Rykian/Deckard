import { ComponentMeta, ComponentStory } from '@storybook/react'
import { JSXElementConstructor, useState } from 'react'
import Music from '.'
import colCover from './col.jpg'

export default {
  title: 'Music',
  component: Music,
} as ComponentMeta<typeof Music>

const Template: ComponentStory<typeof Music> = (args) => <Music {...args} />

const firstTrack = {
  cover:
    'https://upload.wikimedia.org/wikipedia/en/3/3b/TheProdigy-TheFatOfTheLand.jpg',
  album: 'The Fat of the Land',
  artists: ['Prodigy', 'Shahin Badar'],
  name: 'Smack My Bitch Up',
}
const secondTrack = {
  cover: colCover,
  album: 'Vertical',
  artists: ['Cult of Luna'],
  name: 'Vicarious Redemption',
}

export const Example = Template.bind({})
Example.args = {
  track: firstTrack,
}

export const Switching: ComponentStory<JSXElementConstructor<{}>> =
  () => {
    const [currentTrack, setCurrentTrack] = useState<typeof firstTrack | undefined>(firstTrack)
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
