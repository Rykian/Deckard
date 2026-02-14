import { gql } from '@apollo/client'
import { useApolloClient, useMutation, useQuery } from '@apollo/client/react'
import { Button } from '@ui-kitten/components'
import * as AuthSession from 'expo-auth-session'
import { useEffect } from 'react'
import {
  GetTwitchAuthUrlQuery,
  GetTwitchAuthUrlQueryVariables,
  MutationUpdateTwitchTokenFromCodeArgs,
  UpdateTwitchTokenMutationVariables,
} from '../../gql/graphql'
import { TWITCH_USERNAME } from './Home'

const TWITCH_URL = gql`
  query GetTwitchAuthURL($redirectURI: String!) {
    getTwitchAuthURL(redirectURI: $redirectURI)
    twitchGetClientId
  }
`
const UPDATE_TWITCH_TOKEN = gql`
  mutation updateTwitchToken($code: String!, $redirectURI: String!) {
    updateTwitchTokenFromCode(code: $code, redirectURI: $redirectURI)
  }
`

const TwitchLogin = () => {
  const apollo = useApolloClient()
  const redirectURI = AuthSession.makeRedirectUri({ scheme: 'deckard' })

  const { getTwitchAuthURL: authUrl, twitchGetClientId: clientId } =
    useQuery<GetTwitchAuthUrlQuery, GetTwitchAuthUrlQueryVariables>(
      TWITCH_URL,
      { variables: { redirectURI } },
    ).data ?? {}

  const discovery = {
    authorizationEndpoint: authUrl ?? '',
  }

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: clientId ?? 'YOUR_TWITCH_CLIENT_ID',
      redirectUri: redirectURI,
    },
    discovery,
  )

  const [update] = useMutation<
    MutationUpdateTwitchTokenFromCodeArgs,
    UpdateTwitchTokenMutationVariables
  >(UPDATE_TWITCH_TOKEN)

  useEffect(() => {
    if (response?.type !== 'success') return

    const code = response.params?.['code']
    if (!code) return

    update({ variables: { code, redirectURI } })
      .then(() => apollo.refetchQueries({ include: [TWITCH_USERNAME] }))
      .catch(() => {})
  }, [apollo, redirectURI, response, update])

  return (
    <Button
      onPress={async () => {
        if (!authUrl) return

        await promptAsync()
      }}
      disabled={!authUrl || !request}
    >
      Login
    </Button>
  )
}

export default TwitchLogin
