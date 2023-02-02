const { resolve } = require('path')

module.exports = {
  client: {
    includes: ['./**/*.tsx'],
    excludes: ['./node_modules'],
    service: {
      name: 'backend',
      localSchemaFile: resolve(__dirname, '../schema.graphql'),
    },
  },
}
