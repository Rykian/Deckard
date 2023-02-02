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
  updateSpotifyAuth: Scalars['Boolean'];
};


export type MutationObsConnectArgs = {
  host: Scalars['String'];
  password?: InputMaybe<Scalars['String']>;
  port: Scalars['String'];
};


export type MutationUpdateSpotifyAuthArgs = {
  code: Scalars['String'];
  redirectURI: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  getCurrentTrack?: Maybe<Track>;
  getSpotifyAuthURL: Scalars['String'];
  getSpotifyUserName?: Maybe<Scalars['String']>;
  obsConnected: Scalars['Boolean'];
  obsCurrentInstance?: Maybe<Scalars['String']>;
  obsInstanceList: Array<Instance>;
  obsStreamIsStreaming: Scalars['Boolean'];
};


export type QueryGetSpotifyAuthUrlArgs = {
  redirectURI: Scalars['String'];
};

export type Subscription = {
  __typename?: 'Subscription';
  currentTrackUpdated?: Maybe<Track>;
  obsCurrentInstanceUpdated?: Maybe<Scalars['String']>;
  obsStreamStreamingUpdated: Scalars['Boolean'];
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

export type CurrentTrackSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type CurrentTrackSubscription = { __typename?: 'Subscription', currentTrackUpdated?: { __typename?: 'Track', id: string, artists: Array<string>, album: string, name: string, release: string, cover: string, url: string } | null };


export const CurrentTrackDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"currentTrack"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentTrackUpdated"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"artists"}},{"kind":"Field","name":{"kind":"Name","value":"album"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"release"}},{"kind":"Field","name":{"kind":"Name","value":"cover"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]} as unknown as DocumentNode<CurrentTrackSubscription, CurrentTrackSubscriptionVariables>;