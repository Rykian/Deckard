import { css } from '@emotion/react'
import bold from './UbuntuMono-Bold.ttf'
import boldItalic from './UbuntuMono-BoldItalic.ttf'
import italic from './UbuntuMono-Italic.ttf'
import regular from './UbuntuMono-Regular.ttf'

export const $UbuntuMonoRegular = css`
  @font-face {
    font-family: Ubuntu Mono;
    src: url(${regular});
  }
`

export const $UbuntuMonoBold = css`
  @font-face {
    font-family: Ubuntu Mono;
    font-weight: bold;
    src: url(${bold});
  }
`

export const $UbuntuMonoRegularItalic = css`
  @font-face {
    font-family: Ubuntu Mono;
    font-style: italic;
    src: url(${italic});
  }
`

export const $UbuntuMonoBoldItalic = css`
  @font-face {
    font-family: Ubuntu Mono;
    font-weight: bold;
    font-style: italic;
    src: url(${boldItalic});
  }
`

const $UbuntuMonoFont = css`
  ${$UbuntuMonoRegular}
  ${$UbuntuMonoRegularItalic}
  ${$UbuntuMonoBold}
  ${$UbuntuMonoBoldItalic}
`

export default $UbuntuMonoFont
