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
};


export type MutationObsConnectArgs = {
  host: Scalars['String'];
  password?: InputMaybe<Scalars['String']>;
  port: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  obsConnected: Scalars['Boolean'];
  obsCurrentInstance?: Maybe<Scalars['String']>;
  obsInstanceList: Array<Instance>;
  obsStreamIsStreaming: Scalars['Boolean'];
};

export type Subscription = {
  __typename?: 'Subscription';
  obsCurrentInstanceUpdated?: Maybe<Scalars['String']>;
  obsStreamStreamingUpdated: Scalars['Boolean'];
};

export type ObsCurrentInstanceSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type ObsCurrentInstanceSubscription = { __typename?: 'Subscription', obsCurrentInstanceUpdated?: string | null };

export type ListObsInstancesQueryVariables = Exact<{ [key: string]: never; }>;


export type ListObsInstancesQuery = { __typename?: 'Query', obsInstanceList: Array<{ __typename?: 'Instance', ip: string, port: string, hostname?: string | null }> };

export type SelectObsInstanceMutationVariables = Exact<{
  host: Scalars['String'];
  port: Scalars['String'];
}>;


export type SelectObsInstanceMutation = { __typename?: 'Mutation', obsConnect: boolean };


export const ObsCurrentInstanceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"obsCurrentInstance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"obsCurrentInstanceUpdated"}}]}}]} as unknown as DocumentNode<ObsCurrentInstanceSubscription, ObsCurrentInstanceSubscriptionVariables>;
export const ListObsInstancesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListObsInstances"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"obsInstanceList"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ip"}},{"kind":"Field","name":{"kind":"Name","value":"port"}},{"kind":"Field","name":{"kind":"Name","value":"hostname"}}]}}]}}]} as unknown as DocumentNode<ListObsInstancesQuery, ListObsInstancesQueryVariables>;
export const SelectObsInstanceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SelectOBSInstance"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"host"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"port"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"obsConnect"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"host"},"value":{"kind":"Variable","name":{"kind":"Name","value":"host"}}},{"kind":"Argument","name":{"kind":"Name","value":"port"},"value":{"kind":"Variable","name":{"kind":"Name","value":"port"}}}]}]}}]} as unknown as DocumentNode<SelectObsInstanceMutation, SelectObsInstanceMutationVariables>;