import { Logger } from '@nestjs/common'
import type { ApolloServerPlugin } from '@apollo/server'

export class GraphQLLoggingPlugin implements ApolloServerPlugin {
  private readonly logger = new Logger('GraphQL')

  async requestDidStart() {
    const logger = this.logger
    const startTime = Date.now()
    let operationType: string
    let operationName: string

    return {
      async didResolveOperation(requestContext: any) {
        operationType = requestContext.operation?.operation || 'unknown'
        operationName = requestContext.operationName || 'UnnamedOperation'
        const query = requestContext.request.query || ''
        const variables = requestContext.request.variables || {}

        logger.log(
          `${operationType.toUpperCase()} ${operationName}\nQuery: ${query}\nVariables: ${JSON.stringify(variables, null, 2)}`,
        )
      },

      async willSendResponse(requestContext: any) {
        const duration = Date.now() - startTime

        // Skip logging for subscriptions - they don't have a single response
        if (operationType === 'subscription') {
          return
        }

        if (requestContext.errors && requestContext.errors.length > 0) {
          logger.error(
            `${operationName} failed in ${duration}ms: ${requestContext.errors.map((e: any) => e.message).join(', ')}`,
          )
        } else {
          logger.log(`${operationName} completed in ${duration}ms`)
        }
      },

      async didEncounterErrors(requestContext: any) {
        const name = requestContext.operationName || 'UnnamedOperation'
        requestContext.errors?.forEach((error: any) => {
          logger.error(`${name}: ${error.message}`, error.stack)
        })
      },

      async didSubscribe(requestContext: any) {
        const operationName = requestContext.operationName || 'UnnamedOperation'
        logger.log(`📡 SUBSCRIPTION ${operationName} connected (WebSocket)`)
        return undefined
      },

      async didResolveSubscriptionSource(requestContext: any) {
        const operationName = requestContext.operationName || 'UnnamedOperation'
        logger.debug(`📡 ${operationName} source subscribed`)
        return undefined
      },
    }
  }
}
