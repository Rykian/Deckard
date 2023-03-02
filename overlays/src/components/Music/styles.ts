import { css } from '@emotion/react'
import { Colors } from '.'

export const $container = css`
  margin: 1em;
  display: grid;
  grid-template-columns: min-content min-content;
  border-radius: 0.5em;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
`

export const $image = css`
  height: 5em;
  width: 5em;
  object-fit: cover;
  border-radius: 0.3em;
  z-index: 1;
`

export const $infos = (theme: Colors) => css`
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  z-index: 0;
  display: grid;
  grid-auto-rows: min-content;
  padding: 0.5em;
  padding-right: 1.5em;
  padding-left: 10.5em;
  border-radius: 0 0.5em 0.5em 0;
  margin-left: -10em;
  background-color: ${theme?.primaryColor};
  height: min-content;
  width: 28em;
  box-shadow: 0 0 5px ${theme?.primaryColor};
`
const ellipsis = css`
  overflow: hidden;
  text-overflow: ellipsis;
`

export const $album = (theme: Colors) => css`
  font-size: 0.8em;
  color: ${theme?.secondaryColor};
  ${ellipsis};
`
export const $name = (theme: Colors) => css`
  color: ${theme?.tercaryColor};
  ${ellipsis};
`
export const $artists = (theme: Colors) => css`
  color: ${theme?.secondaryColor};
  ${ellipsis};
`

export const $progress = (theme: Colors) => css`
  --max-width: 17.8em;
  background-color: ${theme?.tercaryColor};
  height: 3px;
  transition: width 1s linear;
  position: absolute;
  left: 10em;
  bottom: 0;
`
