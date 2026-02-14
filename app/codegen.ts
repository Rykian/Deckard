import type { CodegenConfig } from '@graphql-codegen/cli'
import { resolve } from 'path'

const config: CodegenConfig = {
  schema: resolve(__dirname, '../schema.graphql'),
  documents: ['./screens/**/*.tsx'],
  generates: {
    './gql/': {
      preset: 'client',
      plugins: [],
    },
  },
}
export default config
