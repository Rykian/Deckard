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
  streamWebcamToggle: Scalars['Boolean'];
  streamWebcamToggleBlur: Scalars['Boolean'];
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

export type PortScannerResult = {
  __typename?: 'PortScannerResult';
  hostname?: Maybe<Scalars['String']>;
  ip: Scalars['String'];
  password?: Maybe<Scalars['String']>;
  port: Scalars['String'];
  secure?: Maybe<Scalars['Boolean']>;
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
  obsInstanceList: Array<PortScannerResult>;
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
  currentTrackProgress?: Maybe<Scalars['Int']>;
  currentTrackUpdated?: Maybe<Track>;
  obsCurrentInstanceUpdated?: Maybe<Scalars['String']>;
  obsScenesCurrentChanged: Scalars['String'];
  obsScenesListUpdated: Array<Scalars['String']>;
  obsStreamStreamingUpdated: Scalars['Boolean'];
  /** Return the name of expired counters */
  streamCountdownExpired: Scalars['String'];
  /** Notify when a countdown has been updated */
  streamCountdownUpdated: Scalars['String'];
  streamStateChanged?: Maybe<StreamStateEnum>;
  streamWebcamBlurChanged: Scalars['Boolean'];
  streamWebcamChanged: Scalars['Boolean'];
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
  /** Duration in ms */
  duration: Scalars['Float'];
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

export type CountdownUpdateSubscriptionVariables = Exact<{
  name: Scalars['String'];
}>;


export type CountdownUpdateSubscription = { __typename?: 'Subscription', streamCountdownUpdated: string };

export type TwitchInfosQueryVariables = Exact<{ [key: string]: never; }>;


export type TwitchInfosQuery = { __typename?: 'Query', twitchGetClientId?: string | null, getTwitchUserName?: string | null };

export type CurrentTrackSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type CurrentTrackSubscription = { __typename?: 'Subscription', currentTrackUpdated?: { __typename?: 'Track', id: string, artists: Array<string>, album: string, name: string, release: string, cover: string, url: string, duration: number } | null };

export type CurrentTrackProgressSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type CurrentTrackProgressSubscription = { __typename?: 'Subscription', currentTrackProgress?: number | null };


export const CountdownUpdateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"countdownUpdate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"streamCountdownUpdated"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}]}]}}]} as unknown as DocumentNode<CountdownUpdateSubscription, CountdownUpdateSubscriptionVariables>;
export const TwitchInfosDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TwitchInfos"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"twitchGetClientId"}},{"kind":"Field","name":{"kind":"Name","value":"getTwitchUserName"}}]}}]} as unknown as DocumentNode<TwitchInfosQuery, TwitchInfosQueryVariables>;
export const CurrentTrackDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"currentTrack"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentTrackUpdated"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"artists"}},{"kind":"Field","name":{"kind":"Name","value":"album"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"release"}},{"kind":"Field","name":{"kind":"Name","value":"cover"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}}]}}]} as unknown as DocumentNode<CurrentTrackSubscription, CurrentTrackSubscriptionVariables>;
export const CurrentTrackProgressDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"currentTrackProgress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentTrackProgress"}}]}}]} as unknown as DocumentNode<CurrentTrackProgressSubscription, CurrentTrackProgressSubscriptionVariables>;