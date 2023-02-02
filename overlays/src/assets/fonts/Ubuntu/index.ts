import { css } from '@emotion/react'
import bold from './Ubuntu-Bold.ttf'
import boldItalic from './Ubuntu-BoldItalic.ttf'
import italic from './Ubuntu-Italic.ttf'
import regular from './Ubuntu-Regular.ttf'

export const $UbuntuRegular = css`
  @font-face {
    font-family: Ubuntu;
    src: url(${regular});
  }
`

export const $UbuntuBold = css`
  @font-face {
    font-family: Ubuntu;
    font-weight: bold;
    src: url(${bold});
  }
`

export const $UbuntuRegularItalic = css`
  @font-face {
    font-family: Ubuntu;
    font-style: italic;
    src: url(${italic});
  }
`

export const $UbuntuBoldItalic = css`
  @font-face {
    font-family: Ubuntu;
    font-weight: bold;
    font-style: italic;
    src: url(${boldItalic});
  }
`

const $UbuntuFont = css`
  ${$UbuntuRegular}
  ${$UbuntuRegularItalic}
  ${$UbuntuBold}
  ${$UbuntuBoldItalic}
`

export default $UbuntuFont
