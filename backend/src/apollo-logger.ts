import { Logger } from '@nestjs/common'
import { PluginDefinition } from 'apollo-server-core'

const logger = new Logger('GraphQL')

const apolloLogger: PluginDefinition = {
  requestDidStart: async (context) => {
    if (context.request.operationName == 'IntrospectionQuery') return
    logger.log(context.request.query?.replace(/\s\s+/g, ' ').replace(/\n/, ' '))
  },
}
export default apolloLogger
