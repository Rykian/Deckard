import { split, HttpLink, InMemoryCache, ApolloClient } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { WebSocketLink } from '@apollo/client/link/ws'
import { useMemo } from 'react'

const useApolloClient = (url: string) =>
  useMemo(() => {
    if (!url) return

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

    return new ApolloClient({
      link: splitLink,
      cache: new InMemoryCache(),
    })
  }, [url])

export default useApolloClient
