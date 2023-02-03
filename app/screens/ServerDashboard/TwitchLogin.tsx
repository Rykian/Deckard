import { gql, useApolloClient, useMutation, useQuery } from '@apollo/client'
import { Button } from '@ui-kitten/components'
import * as AuthSession from 'expo-auth-session'
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
  }
`
const UPDATE_TWITCH_TOKEN = gql`
  mutation updateTwitchToken($code: String!, $redirectURI: String!) {
    updateTwitchTokenFromCode(code: $code, redirectURI: $redirectURI)
  }
`

const TwitchLogin = () => {
  const apollo = useApolloClient()
  const redirectURI = AuthSession.makeRedirectUri({ useProxy: true })

  const authUrl = useQuery<
    GetTwitchAuthUrlQuery,
    GetTwitchAuthUrlQueryVariables
  >(TWITCH_URL, { variables: { redirectURI } }).data?.getTwitchAuthURL

  const [update] = useMutation<
    MutationUpdateTwitchTokenFromCodeArgs,
    UpdateTwitchTokenMutationVariables
  >(UPDATE_TWITCH_TOKEN)

  return (
    <Button
      onPress={async () => {
        if (!authUrl) return

        const session = await AuthSession.startAsync({ authUrl })
        if (session.type == 'success') {
          await update({
            variables: { code: session.params['code'], redirectURI },
          })
          await apollo.refetchQueries({ include: [TWITCH_USERNAME] })
        }
      }}
    >
      Login
    </Button>
  )
}

export default TwitchLogin
