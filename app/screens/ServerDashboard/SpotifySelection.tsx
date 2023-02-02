import { gql, useMutation, useQuery } from '@apollo/client'
import { Button, Text } from '@ui-kitten/components'
import * as AuthSession from 'expo-auth-session'
import {
  SpotifyAuthQuery,
  SpotifyAuthQueryVariables,
  UpdateSpotifyMutation,
  UpdateSpotifyMutationVariables,
} from '../../gql/graphql'

const SPOTIFY_URL = gql`
  query spotifyAuth($redirectURI: String!) {
    getSpotifyAuthURL(redirectURI: $redirectURI)
  }
`

const UPDATE_SPOTIFY = gql`
  mutation updateSpotify($code: String!, $redirectURI: String!) {
    updateSpotifyAuth(code: $code, redirectURI: $redirectURI)
  }
`

const SpotifySelection = () => {
  const redirectURI = AuthSession.makeRedirectUri({ useProxy: true })
  console.log({ redirectURI })
  const authUrl = useQuery<SpotifyAuthQuery, SpotifyAuthQueryVariables>(
    SPOTIFY_URL,
    {
      variables: { redirectURI },
    }
  ).data?.getSpotifyAuthURL

  const [update] = useMutation<
    UpdateSpotifyMutation,
    UpdateSpotifyMutationVariables
  >(UPDATE_SPOTIFY)

  return (
    <Button
      onPress={async () => {
        if (!authUrl) return

        const session = await AuthSession.startAsync({ authUrl })
        if (session.type == 'success') {
          await update({
            variables: { code: session.params['code'], redirectURI },
          })
        }
      }}
    >
      Login
    </Button>
  )
}

export default SpotifySelection
