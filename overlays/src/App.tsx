import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  split,
} from '@apollo/client'
import { css, Global } from '@emotion/react'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import $UbuntuFont from './assets/fonts/Ubuntu'
import $UbuntuMonoFont from './assets/fonts/Ubuntu_Mono'
import MusicOverlay from './overlays/Music'
import { WebSocketLink } from '@apollo/client/link/ws'
import { getMainDefinition } from '@apollo/client/utilities'

const List = () => {
  return (
    <ul>
      <li>
        <Link to="/music">/music</Link>
      </li>
    </ul>
  )
}

export const $global = css`
  body {
    margin: 0;
    padding: 0;
    ${$UbuntuFont}
    ${$UbuntuMonoFont}
    font-family: 'Ubuntu';
  }
`

const url = 'http://localhost:3000'

const httpLink = new HttpLink({ uri: url + '/graphql' })

const wsLink = new WebSocketLink({
  uri: url.replace('http', 'ws') + '/graphql',
  options: { reconnect: true },
})

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  httpLink
)

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
})

const App = () => (
  <ApolloProvider client={client}>
    <Global styles={$global} />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<List />} />
        <Route path="/music" element={<MusicOverlay />} />
      </Routes>
    </BrowserRouter>
  </ApolloProvider>
)

export default App
