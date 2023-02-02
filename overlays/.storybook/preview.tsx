import React from 'react'
import { Global, css } from '@emotion/react'
import { $global } from '../src/App'
import '@storybook/addon-console'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

const withGlobalStyle = (Story) => (
  <>
    <Global styles={$global} />
    <Story />
  </>
)

export const decorators = [withGlobalStyle]
