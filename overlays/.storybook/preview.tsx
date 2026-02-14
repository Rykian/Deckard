import { spyOn } from 'storybook/test'
import { Global } from '@emotion/react'
import { $global } from '../src/App'
import type { Decorator } from '@storybook/react'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

const withGlobalStyle: Decorator = (Story) => (
  <>
    <Global styles={$global} />
    <Story />
  </>
)

export const decorators = [withGlobalStyle]

export const beforeEach = function beforeEach() {
  spyOn(console, 'log').mockName('console.log')
  spyOn(console, 'warn').mockName('console.warn')
  spyOn(console, 'error').mockName('console.error')
  spyOn(console, 'info').mockName('console.info')
  spyOn(console, 'debug').mockName('console.debug')
  spyOn(console, 'trace').mockName('console.trace')
  spyOn(console, 'count').mockName('console.count')
  spyOn(console, 'dir').mockName('console.dir')
  spyOn(console, 'assert').mockName('console.assert')
}
