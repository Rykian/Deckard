import { gql, useQuery } from '@apollo/client'
import { Button, Layout } from '@ui-kitten/components'
import { useEffect } from 'react'
import { Platform } from 'react-native'
import WebView from 'react-native-webview'
import { StepProps } from '.'
import { styles } from '..'
import { GetTwitchUsernameQuery } from '../../../../../gql/graphql'

const USERNAME = gql`
  query GetTwitchUsername {
    twitchGetUsername
  }
`

const CheckStreamDetails = (props: StepProps) => {
  const twitchUsernameQuery = useQuery<GetTwitchUsernameQuery>(USERNAME)
  const username = twitchUsernameQuery.data?.twitchGetUsername
  const uri = `https://dashboard.twitch.tv/popout/u/${username}/stream-manager/edit-stream-info`
  useEffect(() => {
    props.navigation.setOptions({ title: 'Check stream details' })
  }, [])

  return username ? (
    <Layout style={{ flex: 1 }}>
      {Platform.OS != 'web' ? (
        <WebView source={{ uri }} />
      ) : (
        // Need HTTPS for this one?
        <iframe src={uri} />
      )}
      <Button onPress={props.nextStep} size="giant" style={styles.nextButton}>
        Next
      </Button>
    </Layout>
  ) : (
    <></>
  )
}

export default CheckStreamDetails
