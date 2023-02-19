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
    "\n  query twitchUserName {\n    twitchGetUsername\n  }\n": types.TwitchUserNameDocument,
    "\n  query ListObsInstances {\n    obsInstanceList {\n      ip\n      port\n      hostname\n    }\n  }\n": types.ListObsInstancesDocument,
    "\n  mutation SelectOBSInstance($host: String!, $port: String!) {\n    obsConnect(host: $host, port: $port)\n  }\n": types.SelectObsInstanceDocument,
    "\n  query spotifyAuth($redirectURI: String!) {\n    getSpotifyAuthURL(redirectURI: $redirectURI)\n  }\n": types.SpotifyAuthDocument,
    "\n  mutation updateSpotify($code: String!, $redirectURI: String!) {\n    updateSpotifyAuth(code: $code, redirectURI: $redirectURI)\n  }\n": types.UpdateSpotifyDocument,
    "\n  query GetTwitchAuthURL($redirectURI: String!) {\n    getTwitchAuthURL(redirectURI: $redirectURI)\n  }\n": types.GetTwitchAuthUrlDocument,
    "\n  mutation updateTwitchToken($code: String!, $redirectURI: String!) {\n    updateTwitchTokenFromCode(code: $code, redirectURI: $redirectURI)\n  }\n": types.UpdateTwitchTokenDocument,
    "\n  subscription ScenesListForSwitches {\n    obsScenesListUpdated\n  }\n": types.ScenesListForSwitchesDocument,
    "\n  mutation SwitchSceneFromSwitches($scene: String!) {\n    obsScenesSwitch(scene: $scene)\n  }\n": types.SwitchSceneFromSwitchesDocument,
    "\n  subscription CurrentSceneForSwitches {\n    obsScenesCurrentChanged\n  }\n": types.CurrentSceneForSwitchesDocument,
    "\n  mutation PauseStream {\n    streamSequencePause\n  }\n": types.PauseStreamDocument,
    "\n  mutation UnpauseStream($scene: String) {\n    streamSequencePauseUnpause(scene: $scene)\n  }\n": types.UnpauseStreamDocument,
    "\n  mutation SetPauseTimer($resumeDate: String!) {\n    streamCountdownSet(target: $resumeDate, name: \"pause\")\n  }\n": types.SetPauseTimerDocument,
    "\n  query GetTwitchUsername {\n    twitchGetUsername\n  }\n": types.GetTwitchUsernameDocument,
    "\n  subscription StartTimerCountdown {\n    streamCountdownUpdated(name: \"start\")\n  }\n": types.StartTimerCountdownDocument,
    "\n  mutation ToggleStartStreamOnExpiring($scene: String!) {\n    streamSequenceStartToggleOnCountdownExpiring(scene: $scene)\n  }\n": types.ToggleStartStreamOnExpiringDocument,
    "\n  mutation StartImmediately($scene: String!) {\n    streamSequenceStartImmediatly(scene: $scene)\n  }\n": types.StartImmediatelyDocument,
    "\n  query ListStartScenes {\n    obsScenesList\n  }\n": types.ListStartScenesDocument,
    "\n  mutation StartStreaming($target: String) {\n    streamSequenceStart(targetedTime: $target)\n  }\n": types.StartStreamingDocument,
    "\n  mutation StopStream {\n    streamSequenceStop\n  }\n": types.StopStreamDocument,
    "\n  subscription StreamState {\n    streamStateChanged\n  }\n": types.StreamStateDocument,
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
export function graphql(source: "\n  query twitchUserName {\n    twitchGetUsername\n  }\n"): (typeof documents)["\n  query twitchUserName {\n    twitchGetUsername\n  }\n"];
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
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetTwitchAuthURL($redirectURI: String!) {\n    getTwitchAuthURL(redirectURI: $redirectURI)\n  }\n"): (typeof documents)["\n  query GetTwitchAuthURL($redirectURI: String!) {\n    getTwitchAuthURL(redirectURI: $redirectURI)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation updateTwitchToken($code: String!, $redirectURI: String!) {\n    updateTwitchTokenFromCode(code: $code, redirectURI: $redirectURI)\n  }\n"): (typeof documents)["\n  mutation updateTwitchToken($code: String!, $redirectURI: String!) {\n    updateTwitchTokenFromCode(code: $code, redirectURI: $redirectURI)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  subscription ScenesListForSwitches {\n    obsScenesListUpdated\n  }\n"): (typeof documents)["\n  subscription ScenesListForSwitches {\n    obsScenesListUpdated\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SwitchSceneFromSwitches($scene: String!) {\n    obsScenesSwitch(scene: $scene)\n  }\n"): (typeof documents)["\n  mutation SwitchSceneFromSwitches($scene: String!) {\n    obsScenesSwitch(scene: $scene)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  subscription CurrentSceneForSwitches {\n    obsScenesCurrentChanged\n  }\n"): (typeof documents)["\n  subscription CurrentSceneForSwitches {\n    obsScenesCurrentChanged\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation PauseStream {\n    streamSequencePause\n  }\n"): (typeof documents)["\n  mutation PauseStream {\n    streamSequencePause\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UnpauseStream($scene: String) {\n    streamSequencePauseUnpause(scene: $scene)\n  }\n"): (typeof documents)["\n  mutation UnpauseStream($scene: String) {\n    streamSequencePauseUnpause(scene: $scene)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SetPauseTimer($resumeDate: String!) {\n    streamCountdownSet(target: $resumeDate, name: \"pause\")\n  }\n"): (typeof documents)["\n  mutation SetPauseTimer($resumeDate: String!) {\n    streamCountdownSet(target: $resumeDate, name: \"pause\")\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetTwitchUsername {\n    twitchGetUsername\n  }\n"): (typeof documents)["\n  query GetTwitchUsername {\n    twitchGetUsername\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  subscription StartTimerCountdown {\n    streamCountdownUpdated(name: \"start\")\n  }\n"): (typeof documents)["\n  subscription StartTimerCountdown {\n    streamCountdownUpdated(name: \"start\")\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ToggleStartStreamOnExpiring($scene: String!) {\n    streamSequenceStartToggleOnCountdownExpiring(scene: $scene)\n  }\n"): (typeof documents)["\n  mutation ToggleStartStreamOnExpiring($scene: String!) {\n    streamSequenceStartToggleOnCountdownExpiring(scene: $scene)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation StartImmediately($scene: String!) {\n    streamSequenceStartImmediatly(scene: $scene)\n  }\n"): (typeof documents)["\n  mutation StartImmediately($scene: String!) {\n    streamSequenceStartImmediatly(scene: $scene)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ListStartScenes {\n    obsScenesList\n  }\n"): (typeof documents)["\n  query ListStartScenes {\n    obsScenesList\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation StartStreaming($target: String) {\n    streamSequenceStart(targetedTime: $target)\n  }\n"): (typeof documents)["\n  mutation StartStreaming($target: String) {\n    streamSequenceStart(targetedTime: $target)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation StopStream {\n    streamSequenceStop\n  }\n"): (typeof documents)["\n  mutation StopStream {\n    streamSequenceStop\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  subscription StreamState {\n    streamStateChanged\n  }\n"): (typeof documents)["\n  subscription StreamState {\n    streamStateChanged\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;