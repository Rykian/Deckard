import type { CodegenConfig } from '@graphql-codegen/cli'
import { resolve } from 'path'

const config: CodegenConfig = {
   schema: resolve(__dirname, '../schema.graphql'),
   documents: ['./src/**/*.tsx'],
   generates: {
      './src/gql/': {
        preset: 'client',
        plugins: []
      }
   }
}
export default config
