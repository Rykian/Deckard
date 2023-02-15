const { resolve } = require('path')

module.exports = {
  client: {
    includes: [resolve(__dirname, 'screens/**/*.tsx')],
    excludes: [resolve(__dirname, 'node_modules')],
    service: {
      name: 'backend',
      localSchemaFile: resolve(__dirname, '../schema.graphql'),
    },
  },
}
