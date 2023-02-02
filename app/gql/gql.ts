/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel-plugin for production.
 */
const documents = {
    "\n  subscription obsCurrentInstance {\n    obsCurrentInstanceUpdated\n  }\n": types.ObsCurrentInstanceDocument,
    "\n  query spotifyUserName {\n    getSpotifyUserName\n  }\n": types.SpotifyUserNameDocument,
    "\n  query ListObsInstances {\n    obsInstanceList {\n      ip\n      port\n      hostname\n    }\n  }\n": types.ListObsInstancesDocument,
    "\n  mutation SelectOBSInstance($host: String!, $port: String!) {\n    obsConnect(host: $host, port: $port)\n  }\n": types.SelectObsInstanceDocument,
    "\n  query spotifyAuth($redirectURI: String!) {\n    getSpotifyAuthURL(redirectURI: $redirectURI)\n  }\n": types.SpotifyAuthDocument,
    "\n  mutation updateSpotify($code: String!, $redirectURI: String!) {\n    updateSpotifyAuth(code: $code, redirectURI: $redirectURI)\n  }\n": types.UpdateSpotifyDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  subscription obsCurrentInstance {\n    obsCurrentInstanceUpdated\n  }\n"): (typeof documents)["\n  subscription obsCurrentInstance {\n    obsCurrentInstanceUpdated\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query spotifyUserName {\n    getSpotifyUserName\n  }\n"): (typeof documents)["\n  query spotifyUserName {\n    getSpotifyUserName\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ListObsInstances {\n    obsInstanceList {\n      ip\n      port\n      hostname\n    }\n  }\n"): (typeof documents)["\n  query ListObsInstances {\n    obsInstanceList {\n      ip\n      port\n      hostname\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SelectOBSInstance($host: String!, $port: String!) {\n    obsConnect(host: $host, port: $port)\n  }\n"): (typeof documents)["\n  mutation SelectOBSInstance($host: String!, $port: String!) {\n    obsConnect(host: $host, port: $port)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query spotifyAuth($redirectURI: String!) {\n    getSpotifyAuthURL(redirectURI: $redirectURI)\n  }\n"): (typeof documents)["\n  query spotifyAuth($redirectURI: String!) {\n    getSpotifyAuthURL(redirectURI: $redirectURI)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation updateSpotify($code: String!, $redirectURI: String!) {\n    updateSpotifyAuth(code: $code, redirectURI: $redirectURI)\n  }\n"): (typeof documents)["\n  mutation updateSpotify($code: String!, $redirectURI: String!) {\n    updateSpotifyAuth(code: $code, redirectURI: $redirectURI)\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;