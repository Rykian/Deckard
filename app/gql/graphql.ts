/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type CheckScenesReport = {
  __typename?: 'CheckScenesReport';
  missingItems?: Maybe<Array<ItemReport>>;
  missingScenes?: Maybe<Array<Scalars['String']>>;
};

export type Instance = {
  __typename?: 'Instance';
  hostname?: Maybe<Scalars['String']>;
  ip: Scalars['String'];
  password?: Maybe<Scalars['String']>;
  port: Scalars['String'];
  secure?: Maybe<Scalars['Boolean']>;
};

export type ItemReport = {
  __typename?: 'ItemReport';
  items: Array<Scalars['String']>;
  scene: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  obsConnect: Scalars['Boolean'];
  obsScenesCheck: CheckScenesReport;
  obsScenesSwitch: Scalars['Boolean'];
  /** Return the name of the countdown */
  streamCountdownSet: Scalars['String'];
  /** Set pause scene on stream and returns the previous scene name (before pause) */
  streamSequencePause: Scalars['String'];
  /** Unpause the stream */
  streamSequencePauseUnpause: Scalars['Boolean'];
  streamSequenceStart: Scalars['Boolean'];
  streamSequenceStartImmediatly: Scalars['Boolean'];
  streamSequenceStartToggleOnCountdownExpiring: Scalars['Boolean'];
  streamSequenceStop: Scalars['Boolean'];
  streamSequenceStopCancel: Scalars['Boolean'];
  updateSpotifyAuth: Scalars['Boolean'];
  updateTwitchTokenFromCode: Scalars['Boolean'];
};


export type MutationObsConnectArgs = {
  host: Scalars['String'];
  password?: InputMaybe<Scalars['String']>;
  port: Scalars['String'];
};


export type MutationObsScenesSwitchArgs = {
  instant?: InputMaybe<Scalars['Boolean']>;
  scene: Scalars['String'];
};


export type MutationStreamCountdownSetArgs = {
  name: Scalars['String'];
  target: Scalars['String'];
};


export type MutationStreamSequencePauseUnpauseArgs = {
  scene?: InputMaybe<Scalars['String']>;
};


export type MutationStreamSequenceStartArgs = {
  targetedTime?: InputMaybe<Scalars['String']>;
};


export type MutationStreamSequenceStartImmediatlyArgs = {
  scene: Scalars['String'];
};


export type MutationStreamSequenceStartToggleOnCountdownExpiringArgs = {
  scene: Scalars['String'];
};


export type MutationStreamSequenceStopCancelArgs = {
  scene?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateSpotifyAuthArgs = {
  code: Scalars['String'];
  redirectURI: Scalars['String'];
};


export type MutationUpdateTwitchTokenFromCodeArgs = {
  code: Scalars['String'];
  redirectURI: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  getCurrentTrack?: Maybe<Track>;
  getSpotifyAuthURL: Scalars['String'];
  getSpotifyUserName?: Maybe<Scalars['String']>;
  getTwitchAuthURL: Scalars['String'];
  getTwitchEditStreamInfoUrl?: Maybe<Scalars['String']>;
  /** @deprecated Switching query naming scheme, use `twitchGetUsername` instead */
  getTwitchUserName?: Maybe<Scalars['String']>;
  obsConnected: Scalars['Boolean'];
  obsCurrentInstance?: Maybe<Scalars['String']>;
  obsInstanceList: Array<Instance>;
  obsScenesList: Array<Scalars['String']>;
  obsStreamIsStreaming: Scalars['Boolean'];
  /** Expiration date as ISO string */
  streamCountdownGet: Scalars['String'];
  twitchGetChannelInfo: TwitchChannelInfo;
  twitchGetClientId?: Maybe<Scalars['String']>;
  twitchGetUsername: Scalars['String'];
};


export type QueryGetSpotifyAuthUrlArgs = {
  redirectURI: Scalars['String'];
};


export type QueryGetTwitchAuthUrlArgs = {
  redirectURI?: Scalars['String'];
};


export type QueryStreamCountdownGetArgs = {
  name: Scalars['String'];
};

export enum StreamStateEnum {
  Offline = 'offline',
  Pausing = 'pausing',
  Starting = 'starting',
  Stopping = 'stopping',
  Streaming = 'streaming'
}

export type Subscription = {
  __typename?: 'Subscription';
  currentTrackUpdated?: Maybe<Track>;
  obsCurrentInstanceUpdated?: Maybe<Scalars['String']>;
  obsStreamStreamingUpdated: Scalars['Boolean'];
  /** Return the name of expired counters */
  streamCountdownExpired: Scalars['String'];
  /** Notify when a countdown has been updated */
  streamCountdownUpdated: Scalars['String'];
  streamStateChanged?: Maybe<StreamStateEnum>;
};


export type SubscriptionStreamCountdownExpiredArgs = {
  name?: InputMaybe<Scalars['String']>;
};


export type SubscriptionStreamCountdownUpdatedArgs = {
  name: Scalars['String'];
};

export type Track = {
  __typename?: 'Track';
  album: Scalars['String'];
  artists: Array<Scalars['String']>;
  cover: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  release: Scalars['String'];
  url: Scalars['String'];
};

export type TwitchCategory = {
  __typename?: 'TwitchCategory';
  id: Scalars['String'];
  name: Scalars['String'];
};

export type TwitchChannelInfo = {
  __typename?: 'TwitchChannelInfo';
  category: TwitchCategory;
  title: Scalars['String'];
};

export type ObsCurrentInstanceSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type ObsCurrentInstanceSubscription = { __typename?: 'Subscription', obsCurrentInstanceUpdated?: string | null };

export type SpotifyUserNameQueryVariables = Exact<{ [key: string]: never; }>;


export type SpotifyUserNameQuery = { __typename?: 'Query', getSpotifyUserName?: string | null };

export type TwitchUserNameQueryVariables = Exact<{ [key: string]: never; }>;


export type TwitchUserNameQuery = { __typename?: 'Query', twitchGetUsername: string };

export type ListObsInstancesQueryVariables = Exact<{ [key: string]: never; }>;


export type ListObsInstancesQuery = { __typename?: 'Query', obsInstanceList: Array<{ __typename?: 'Instance', ip: string, port: string, hostname?: string | null }> };

export type SelectObsInstanceMutationVariables = Exact<{
  host: Scalars['String'];
  port: Scalars['String'];
}>;


export type SelectObsInstanceMutation = { __typename?: 'Mutation', obsConnect: boolean };

export type SpotifyAuthQueryVariables = Exact<{
  redirectURI: Scalars['String'];
}>;


export type SpotifyAuthQuery = { __typename?: 'Query', getSpotifyAuthURL: string };

export type UpdateSpotifyMutationVariables = Exact<{
  code: Scalars['String'];
  redirectURI: Scalars['String'];
}>;


export type UpdateSpotifyMutation = { __typename?: 'Mutation', updateSpotifyAuth: boolean };

export type GetTwitchAuthUrlQueryVariables = Exact<{
  redirectURI: Scalars['String'];
}>;


export type GetTwitchAuthUrlQuery = { __typename?: 'Query', getTwitchAuthURL: string };

export type UpdateTwitchTokenMutationVariables = Exact<{
  code: Scalars['String'];
  redirectURI: Scalars['String'];
}>;


export type UpdateTwitchTokenMutation = { __typename?: 'Mutation', updateTwitchTokenFromCode: boolean };

export type PauseStreamMutationVariables = Exact<{ [key: string]: never; }>;


export type PauseStreamMutation = { __typename?: 'Mutation', streamSequencePause: string };

export type UnpauseStreamMutationVariables = Exact<{
  scene?: InputMaybe<Scalars['String']>;
}>;


export type UnpauseStreamMutation = { __typename?: 'Mutation', streamSequencePauseUnpause: boolean };

export type SetPauseTimerMutationVariables = Exact<{
  resumeDate: Scalars['String'];
}>;


export type SetPauseTimerMutation = { __typename?: 'Mutation', streamCountdownSet: string };

export type GetTwitchUsernameQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTwitchUsernameQuery = { __typename?: 'Query', twitchGetUsername: string };

export type StartTimerCountdownSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type StartTimerCountdownSubscription = { __typename?: 'Subscription', streamCountdownUpdated: string };

export type ToggleStartStreamOnExpiringMutationVariables = Exact<{
  scene: Scalars['String'];
}>;


export type ToggleStartStreamOnExpiringMutation = { __typename?: 'Mutation', streamSequenceStartToggleOnCountdownExpiring: boolean };

export type StartImmediatelyMutationVariables = Exact<{
  scene: Scalars['String'];
}>;


export type StartImmediatelyMutation = { __typename?: 'Mutation', streamSequenceStartImmediatly: boolean };

export type ListStartScenesQueryVariables = Exact<{ [key: string]: never; }>;


export type ListStartScenesQuery = { __typename?: 'Query', obsScenesList: Array<string> };

export type StartStreamingMutationVariables = Exact<{
  target?: InputMaybe<Scalars['String']>;
}>;


export type StartStreamingMutation = { __typename?: 'Mutation', streamSequenceStart: boolean };

export type StopStreamMutationVariables = Exact<{ [key: string]: never; }>;


export type StopStreamMutation = { __typename?: 'Mutation', streamSequenceStop: boolean };

export type StreamStateSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type StreamStateSubscription = { __typename?: 'Subscription', streamStateChanged?: StreamStateEnum | null };


export const ObsCurrentInstanceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"obsCurrentInstance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"obsCurrentInstanceUpdated"}}]}}]} as unknown as DocumentNode<ObsCurrentInstanceSubscription, ObsCurrentInstanceSubscriptionVariables>;
export const SpotifyUserNameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"spotifyUserName"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getSpotifyUserName"}}]}}]} as unknown as DocumentNode<SpotifyUserNameQuery, SpotifyUserNameQueryVariables>;
export const TwitchUserNameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"twitchUserName"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"twitchGetUsername"}}]}}]} as unknown as DocumentNode<TwitchUserNameQuery, TwitchUserNameQueryVariables>;
export const ListObsInstancesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListObsInstances"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"obsInstanceList"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ip"}},{"kind":"Field","name":{"kind":"Name","value":"port"}},{"kind":"Field","name":{"kind":"Name","value":"hostname"}}]}}]}}]} as unknown as DocumentNode<ListObsInstancesQuery, ListObsInstancesQueryVariables>;
export const SelectObsInstanceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SelectOBSInstance"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"host"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"port"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"obsConnect"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"host"},"value":{"kind":"Variable","name":{"kind":"Name","value":"host"}}},{"kind":"Argument","name":{"kind":"Name","value":"port"},"value":{"kind":"Variable","name":{"kind":"Name","value":"port"}}}]}]}}]} as unknown as DocumentNode<SelectObsInstanceMutation, SelectObsInstanceMutationVariables>;
export const SpotifyAuthDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"spotifyAuth"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"redirectURI"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getSpotifyAuthURL"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"redirectURI"},"value":{"kind":"Variable","name":{"kind":"Name","value":"redirectURI"}}}]}]}}]} as unknown as DocumentNode<SpotifyAuthQuery, SpotifyAuthQueryVariables>;
export const UpdateSpotifyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateSpotify"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"code"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"redirectURI"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateSpotifyAuth"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"code"}}},{"kind":"Argument","name":{"kind":"Name","value":"redirectURI"},"value":{"kind":"Variable","name":{"kind":"Name","value":"redirectURI"}}}]}]}}]} as unknown as DocumentNode<UpdateSpotifyMutation, UpdateSpotifyMutationVariables>;
export const GetTwitchAuthUrlDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTwitchAuthURL"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"redirectURI"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getTwitchAuthURL"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"redirectURI"},"value":{"kind":"Variable","name":{"kind":"Name","value":"redirectURI"}}}]}]}}]} as unknown as DocumentNode<GetTwitchAuthUrlQuery, GetTwitchAuthUrlQueryVariables>;
export const UpdateTwitchTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateTwitchToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"code"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"redirectURI"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTwitchTokenFromCode"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"code"}}},{"kind":"Argument","name":{"kind":"Name","value":"redirectURI"},"value":{"kind":"Variable","name":{"kind":"Name","value":"redirectURI"}}}]}]}}]} as unknown as DocumentNode<UpdateTwitchTokenMutation, UpdateTwitchTokenMutationVariables>;
export const PauseStreamDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PauseStream"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"streamSequencePause"}}]}}]} as unknown as DocumentNode<PauseStreamMutation, PauseStreamMutationVariables>;
export const UnpauseStreamDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UnpauseStream"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"scene"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"streamSequencePauseUnpause"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"scene"},"value":{"kind":"Variable","name":{"kind":"Name","value":"scene"}}}]}]}}]} as unknown as DocumentNode<UnpauseStreamMutation, UnpauseStreamMutationVariables>;
export const SetPauseTimerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetPauseTimer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"resumeDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"streamCountdownSet"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"target"},"value":{"kind":"Variable","name":{"kind":"Name","value":"resumeDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"StringValue","value":"pause","block":false}}]}]}}]} as unknown as DocumentNode<SetPauseTimerMutation, SetPauseTimerMutationVariables>;
export const GetTwitchUsernameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTwitchUsername"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"twitchGetUsername"}}]}}]} as unknown as DocumentNode<GetTwitchUsernameQuery, GetTwitchUsernameQueryVariables>;
export const StartTimerCountdownDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"StartTimerCountdown"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"streamCountdownUpdated"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"StringValue","value":"start","block":false}}]}]}}]} as unknown as DocumentNode<StartTimerCountdownSubscription, StartTimerCountdownSubscriptionVariables>;
export const ToggleStartStreamOnExpiringDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ToggleStartStreamOnExpiring"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"scene"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"streamSequenceStartToggleOnCountdownExpiring"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"scene"},"value":{"kind":"Variable","name":{"kind":"Name","value":"scene"}}}]}]}}]} as unknown as DocumentNode<ToggleStartStreamOnExpiringMutation, ToggleStartStreamOnExpiringMutationVariables>;
export const StartImmediatelyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"StartImmediately"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"scene"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"streamSequenceStartImmediatly"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"scene"},"value":{"kind":"Variable","name":{"kind":"Name","value":"scene"}}}]}]}}]} as unknown as DocumentNode<StartImmediatelyMutation, StartImmediatelyMutationVariables>;
export const ListStartScenesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListStartScenes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"obsScenesList"}}]}}]} as unknown as DocumentNode<ListStartScenesQuery, ListStartScenesQueryVariables>;
export const StartStreamingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"StartStreaming"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"target"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"streamSequenceStart"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"targetedTime"},"value":{"kind":"Variable","name":{"kind":"Name","value":"target"}}}]}]}}]} as unknown as DocumentNode<StartStreamingMutation, StartStreamingMutationVariables>;
export const StopStreamDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"StopStream"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"streamSequenceStop"}}]}}]} as unknown as DocumentNode<StopStreamMutation, StopStreamMutationVariables>;
export const StreamStateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"StreamState"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"streamStateChanged"}}]}}]} as unknown as DocumentNode<StreamStateSubscription, StreamStateSubscriptionVariables>;