import { split, HttpLink, InMemoryCache, ApolloClient } from '@apollo/client'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import { createClient } from 'graphql-ws'
import { useMemo } from 'react'

const useApolloClient = (url: string) =>
  useMemo(() => {
    if (!url) return

    const httpLink = new HttpLink({ uri: url + '/graphql' })

    const wsUrl = url.replace(/^http/, 'ws') + '/graphql'
    const wsLink = new GraphQLWsLink(
      createClient({
        url: wsUrl,
        lazy: true,
      }),
    )

    const splitLink = split(
      ({ query }) => {
        const definition = getMainDefinition(query)
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        )
      },
      wsLink,
      httpLink,
    )

    return new ApolloClient({
      link: splitLink,
      cache: new InMemoryCache(),
    })
  }, [url])

export default useApolloClient
