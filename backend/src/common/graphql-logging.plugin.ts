import { Logger } from '@nestjs/common'
import type { ApolloServerPlugin } from '@apollo/server'

export class GraphQLLoggingPlugin implements ApolloServerPlugin {
  private readonly logger = new Logger('GraphQL')

  async requestDidStart() {
    const logger = this.logger
    const startTime = Date.now()

    return {
      async didResolveOperation(requestContext: any) {
        const operationName = requestContext.operationName || 'UnnamedOperation'
        const operationType = requestContext.operation?.operation || 'unknown'
        const query = requestContext.request.query || ''
        const variables = requestContext.request.variables || {}

        logger.log(
          `${operationType.toUpperCase()} ${operationName}\nQuery: ${query}\nVariables: ${JSON.stringify(variables, null, 2)}`,
        )
      },

      async willSendResponse(requestContext: any) {
        const duration = Date.now() - startTime
        const operationName = requestContext.operationName || 'UnnamedOperation'

        if (requestContext.errors && requestContext.errors.length > 0) {
          logger.error(
            `${operationName} failed in ${duration}ms: ${requestContext.errors.map((e: any) => e.message).join(', ')}`,
          )
        } else {
          logger.log(`${operationName} completed in ${duration}ms`)
        }
      },

      async didEncounterErrors(requestContext: any) {
        const operationName = requestContext.operationName || 'UnnamedOperation'
        requestContext.errors.forEach((error: any) => {
          logger.error(`${operationName}: ${error.message}`, error.stack)
        })
      },
    }
  }
}
