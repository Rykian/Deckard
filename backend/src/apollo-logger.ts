import { Logger } from '@nestjs/common';
import { PluginDefinition } from 'apollo-server-core';

const logger = new Logger('GraphQL');

const apolloLogger: PluginDefinition = {
  requestDidStart: async (context) => {
    logger.log(
      context.request.query?.replace(/\s\s+/g, ' ').replace(/\n/, ' '),
    );
  },
};
export default apolloLogger;
