import { gql } from '@apollo/client'
import { useApolloClient, useMutation, useQuery } from '@apollo/client/react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Button } from '@ui-kitten/components'
import {
  GetTwitchAuthUrlQuery,
  GetTwitchAuthUrlQueryVariables,
  MutationUpdateTwitchTokenFromCodeArgs,
  UpdateTwitchTokenMutationVariables,
} from '../../gql/graphql'
import { TWITCH_USERNAME } from './Home'
import * as WebBrowser from 'expo-web-browser'
import { ServerDashboardStackParamList } from '.'

const TWITCH_URL = gql`
  query GetTwitchAuthURL($redirectURI: String!) {
    getTwitchAuthURL(redirectURI: $redirectURI)
    twitchGetClientId
  }
`
const TUNNEL_URL = gql`
  query TunnelGetUrl {
    tunnelGetUrl
  }
`
const UPDATE_TWITCH_TOKEN = gql`
  mutation updateTwitchToken($code: String!, $redirectURI: String!) {
    updateTwitchTokenFromCode(code: $code, redirectURI: $redirectURI)
  }
`
WebBrowser.maybeCompleteAuthSession()

type Props = NativeStackScreenProps<
  ServerDashboardStackParamList,
  'TwitchLogin'
>

const TwitchLogin = (props: Props) => {
  const apollo = useApolloClient()
  const { tunnelGetUrl: tunnelUrl } =
    useQuery<{ tunnelGetUrl: string }>(TUNNEL_URL).data ?? {}
  const proxyRedirectUri = tunnelUrl
    ? `${tunnelUrl.replace(/\/$/, '')}/twitch/oauth`
    : ''

  console.log('Redirect URI:', proxyRedirectUri)

  const { getTwitchAuthURL: authUrl } =
    useQuery<GetTwitchAuthUrlQuery, GetTwitchAuthUrlQueryVariables>(
      TWITCH_URL,
      {
        variables: { redirectURI: proxyRedirectUri },
        skip: !proxyRedirectUri,
      },
    ).data ?? {}

  const [update] = useMutation<
    MutationUpdateTwitchTokenFromCodeArgs,
    UpdateTwitchTokenMutationVariables
  >(UPDATE_TWITCH_TOKEN)

  return (
    <Button
      onPress={async () => {
        if (!authUrl) return

        console.log({ authUrl, proxyRedirectUri })

        const session = await WebBrowser.openAuthSessionAsync(
          authUrl,
          proxyRedirectUri,
        )
        if (session.type !== 'success') return

        const sessionUrl = new URL(session.url)
        const code = sessionUrl.searchParams.get('code')
        if (!code) return

        update({ variables: { code, redirectURI: proxyRedirectUri } })
          .then(() => apollo.refetchQueries({ include: [TWITCH_USERNAME] }))
          .catch(() => {})
      }}
      disabled={!authUrl}
    >
      Login
    </Button>
  )
}

export default TwitchLogin
