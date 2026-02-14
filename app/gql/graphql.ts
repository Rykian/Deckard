/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type CheckScenesReport = {
  __typename?: 'CheckScenesReport';
  missingItems?: Maybe<Array<ItemReport>>;
  missingScenes?: Maybe<Array<Scalars['String']['output']>>;
};

export type ItemReport = {
  __typename?: 'ItemReport';
  items: Array<Scalars['String']['output']>;
  scene: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  obsConnect: Scalars['Boolean']['output'];
  obsScenesCheck: CheckScenesReport;
  obsScenesSwitch: Scalars['Boolean']['output'];
  /** Return the name of the countdown */
  streamCountdownSet: Scalars['String']['output'];
  /** Set pause scene on stream and returns the previous scene name (before pause) */
  streamSequencePause: Scalars['String']['output'];
  /** Unpause the stream */
  streamSequencePauseUnpause: Scalars['Boolean']['output'];
  streamSequenceStart: Scalars['Boolean']['output'];
  streamSequenceStartImmediatly: Scalars['Boolean']['output'];
  streamSequenceStartToggleOnCountdownExpiring: Scalars['Boolean']['output'];
  streamSequenceStop: Scalars['Boolean']['output'];
  streamSequenceStopCancel: Scalars['Boolean']['output'];
  streamWebcamToggle: Scalars['Boolean']['output'];
  streamWebcamToggleBlur: Scalars['Boolean']['output'];
  updateTwitchTokenFromCode: Scalars['Boolean']['output'];
};


export type MutationObsConnectArgs = {
  host: Scalars['String']['input'];
  password?: InputMaybe<Scalars['String']['input']>;
  port: Scalars['String']['input'];
};


export type MutationObsScenesSwitchArgs = {
  instant?: InputMaybe<Scalars['Boolean']['input']>;
  scene: Scalars['String']['input'];
};


export type MutationStreamCountdownSetArgs = {
  name: Scalars['String']['input'];
  target: Scalars['String']['input'];
};


export type MutationStreamSequencePauseUnpauseArgs = {
  scene?: InputMaybe<Scalars['String']['input']>;
};


export type MutationStreamSequenceStartArgs = {
  targetedTime?: InputMaybe<Scalars['String']['input']>;
};


export type MutationStreamSequenceStartImmediatlyArgs = {
  scene: Scalars['String']['input'];
};


export type MutationStreamSequenceStartToggleOnCountdownExpiringArgs = {
  scene: Scalars['String']['input'];
};


export type MutationStreamSequenceStopCancelArgs = {
  scene?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateTwitchTokenFromCodeArgs = {
  code: Scalars['String']['input'];
  redirectURI: Scalars['String']['input'];
};

export type PortScannerResult = {
  __typename?: 'PortScannerResult';
  hostname?: Maybe<Scalars['String']['output']>;
  ip: Scalars['String']['output'];
  password?: Maybe<Scalars['String']['output']>;
  port: Scalars['String']['output'];
  secure?: Maybe<Scalars['Boolean']['output']>;
};

export type Query = {
  __typename?: 'Query';
  getCurrentTrack?: Maybe<Track>;
  getTwitchAuthURL: Scalars['String']['output'];
  getTwitchEditStreamInfoUrl?: Maybe<Scalars['String']['output']>;
  /** @deprecated Switching query naming scheme, use `twitchGetUsername` instead */
  getTwitchUserName?: Maybe<Scalars['String']['output']>;
  obsConnected: Scalars['Boolean']['output'];
  obsCurrentInstance?: Maybe<Scalars['String']['output']>;
  obsInstanceList: Array<PortScannerResult>;
  obsScenesList: Array<Scalars['String']['output']>;
  obsStreamIsStreaming: Scalars['Boolean']['output'];
  /** Expiration date as ISO string */
  streamCountdownGet: Scalars['String']['output'];
  twitchGetChannelInfo: TwitchChannelInfo;
  twitchGetClientId?: Maybe<Scalars['String']['output']>;
  twitchGetUsername: Scalars['String']['output'];
};


export type QueryGetTwitchAuthUrlArgs = {
  redirectURI?: Scalars['String']['input'];
};


export type QueryStreamCountdownGetArgs = {
  name: Scalars['String']['input'];
};

export type SceneChanging = {
  __typename?: 'SceneChanging';
  from: Scalars['String']['output'];
  to: Scalars['String']['output'];
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
  currentTrackProgress?: Maybe<Scalars['Int']['output']>;
  currentTrackUpdated?: Maybe<Track>;
  obsCurrentInstanceUpdated?: Maybe<Scalars['String']['output']>;
  obsScenesChanging: SceneChanging;
  obsScenesCurrentChanged: Scalars['String']['output'];
  obsScenesListUpdated: Array<Scalars['String']['output']>;
  obsStreamStreamingUpdated: Scalars['Boolean']['output'];
  /** Return the name of expired counters */
  streamCountdownExpired: Scalars['String']['output'];
  /** Notify when a countdown has been updated */
  streamCountdownUpdated: Scalars['String']['output'];
  streamStateChanged?: Maybe<StreamStateEnum>;
  streamWebcamBlurChanged: Scalars['Boolean']['output'];
  streamWebcamChanged: Scalars['Boolean']['output'];
};


export type SubscriptionStreamCountdownExpiredArgs = {
  name?: InputMaybe<Scalars['String']['input']>;
};


export type SubscriptionStreamCountdownUpdatedArgs = {
  name: Scalars['String']['input'];
};

export type Track = {
  __typename?: 'Track';
  album: Scalars['String']['output'];
  artists: Array<Scalars['String']['output']>;
  cover: Scalars['String']['output'];
  /** Duration in ms */
  duration: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  release: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type TwitchCategory = {
  __typename?: 'TwitchCategory';
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type TwitchChannelInfo = {
  __typename?: 'TwitchChannelInfo';
  category: TwitchCategory;
  title: Scalars['String']['output'];
};

export type ObsCurrentInstanceSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type ObsCurrentInstanceSubscription = { __typename?: 'Subscription', obsCurrentInstanceUpdated?: string | null };

export type TwitchUserNameQueryVariables = Exact<{ [key: string]: never; }>;


export type TwitchUserNameQuery = { __typename?: 'Query', twitchGetUsername: string };

export type ListObsInstancesQueryVariables = Exact<{ [key: string]: never; }>;


export type ListObsInstancesQuery = { __typename?: 'Query', obsInstanceList: Array<{ __typename?: 'PortScannerResult', ip: string, port: string, hostname?: string | null }> };

export type SelectObsInstanceMutationVariables = Exact<{
  host: Scalars['String']['input'];
  port: Scalars['String']['input'];
}>;


export type SelectObsInstanceMutation = { __typename?: 'Mutation', obsConnect: boolean };

export type GetTwitchAuthUrlQueryVariables = Exact<{
  redirectURI: Scalars['String']['input'];
}>;


export type GetTwitchAuthUrlQuery = { __typename?: 'Query', getTwitchAuthURL: string, twitchGetClientId?: string | null };

export type UpdateTwitchTokenMutationVariables = Exact<{
  code: Scalars['String']['input'];
  redirectURI: Scalars['String']['input'];
}>;


export type UpdateTwitchTokenMutation = { __typename?: 'Mutation', updateTwitchTokenFromCode: boolean };

export type ScenesListForSwitchesSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type ScenesListForSwitchesSubscription = { __typename?: 'Subscription', obsScenesListUpdated: Array<string> };

export type SwitchSceneFromSwitchesMutationVariables = Exact<{
  scene: Scalars['String']['input'];
}>;


export type SwitchSceneFromSwitchesMutation = { __typename?: 'Mutation', obsScenesSwitch: boolean };

export type CurrentSceneForSwitchesSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type CurrentSceneForSwitchesSubscription = { __typename?: 'Subscription', obsScenesCurrentChanged: string };

export type PauseStreamMutationVariables = Exact<{ [key: string]: never; }>;


export type PauseStreamMutation = { __typename?: 'Mutation', streamSequencePause: string };

export type UnpauseStreamMutationVariables = Exact<{
  scene?: InputMaybe<Scalars['String']['input']>;
}>;


export type UnpauseStreamMutation = { __typename?: 'Mutation', streamSequencePauseUnpause: boolean };

export type SetPauseTimerMutationVariables = Exact<{
  resumeDate: Scalars['String']['input'];
}>;


export type SetPauseTimerMutation = { __typename?: 'Mutation', streamCountdownSet: string };

export type GetTwitchUsernameQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTwitchUsernameQuery = { __typename?: 'Query', twitchGetUsername: string };

export type StartTimerCountdownSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type StartTimerCountdownSubscription = { __typename?: 'Subscription', streamCountdownUpdated: string };

export type ToggleStartStreamOnExpiringMutationVariables = Exact<{
  scene: Scalars['String']['input'];
}>;


export type ToggleStartStreamOnExpiringMutation = { __typename?: 'Mutation', streamSequenceStartToggleOnCountdownExpiring: boolean };

export type StartImmediatelyMutationVariables = Exact<{
  scene: Scalars['String']['input'];
}>;


export type StartImmediatelyMutation = { __typename?: 'Mutation', streamSequenceStartImmediatly: boolean };

export type ListStartScenesQueryVariables = Exact<{ [key: string]: never; }>;


export type ListStartScenesQuery = { __typename?: 'Query', obsScenesList: Array<string> };

export type StartStreamingMutationVariables = Exact<{
  target?: InputMaybe<Scalars['String']['input']>;
}>;


export type StartStreamingMutation = { __typename?: 'Mutation', streamSequenceStart: boolean };

export type StopStreamMutationVariables = Exact<{ [key: string]: never; }>;


export type StopStreamMutation = { __typename?: 'Mutation', streamSequenceStop: boolean };

export type StreamStateSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type StreamStateSubscription = { __typename?: 'Subscription', streamStateChanged?: StreamStateEnum | null };

export type ToggleCameraVisibilityMutationVariables = Exact<{ [key: string]: never; }>;


export type ToggleCameraVisibilityMutation = { __typename?: 'Mutation', streamWebcamToggle: boolean };

export type ToggleCameraBlurMutationVariables = Exact<{ [key: string]: never; }>;


export type ToggleCameraBlurMutation = { __typename?: 'Mutation', streamWebcamToggleBlur: boolean };

export type CameraVisibilityChangedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type CameraVisibilityChangedSubscription = { __typename?: 'Subscription', streamWebcamChanged: boolean };

export type CameraBlurChangedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type CameraBlurChangedSubscription = { __typename?: 'Subscription', streamWebcamBlurChanged: boolean };


export const ObsCurrentInstanceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"obsCurrentInstance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"obsCurrentInstanceUpdated"}}]}}]} as unknown as DocumentNode<ObsCurrentInstanceSubscription, ObsCurrentInstanceSubscriptionVariables>;
export const TwitchUserNameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"twitchUserName"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"twitchGetUsername"}}]}}]} as unknown as DocumentNode<TwitchUserNameQuery, TwitchUserNameQueryVariables>;
export const ListObsInstancesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListObsInstances"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"obsInstanceList"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ip"}},{"kind":"Field","name":{"kind":"Name","value":"port"}},{"kind":"Field","name":{"kind":"Name","value":"hostname"}}]}}]}}]} as unknown as DocumentNode<ListObsInstancesQuery, ListObsInstancesQueryVariables>;
export const SelectObsInstanceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SelectOBSInstance"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"host"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"port"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"obsConnect"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"host"},"value":{"kind":"Variable","name":{"kind":"Name","value":"host"}}},{"kind":"Argument","name":{"kind":"Name","value":"port"},"value":{"kind":"Variable","name":{"kind":"Name","value":"port"}}}]}]}}]} as unknown as DocumentNode<SelectObsInstanceMutation, SelectObsInstanceMutationVariables>;
export const GetTwitchAuthUrlDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTwitchAuthURL"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"redirectURI"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getTwitchAuthURL"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"redirectURI"},"value":{"kind":"Variable","name":{"kind":"Name","value":"redirectURI"}}}]},{"kind":"Field","name":{"kind":"Name","value":"twitchGetClientId"}}]}}]} as unknown as DocumentNode<GetTwitchAuthUrlQuery, GetTwitchAuthUrlQueryVariables>;
export const UpdateTwitchTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateTwitchToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"code"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"redirectURI"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTwitchTokenFromCode"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"code"}}},{"kind":"Argument","name":{"kind":"Name","value":"redirectURI"},"value":{"kind":"Variable","name":{"kind":"Name","value":"redirectURI"}}}]}]}}]} as unknown as DocumentNode<UpdateTwitchTokenMutation, UpdateTwitchTokenMutationVariables>;
export const ScenesListForSwitchesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"ScenesListForSwitches"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"obsScenesListUpdated"}}]}}]} as unknown as DocumentNode<ScenesListForSwitchesSubscription, ScenesListForSwitchesSubscriptionVariables>;
export const SwitchSceneFromSwitchesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SwitchSceneFromSwitches"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"scene"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"obsScenesSwitch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"scene"},"value":{"kind":"Variable","name":{"kind":"Name","value":"scene"}}}]}]}}]} as unknown as DocumentNode<SwitchSceneFromSwitchesMutation, SwitchSceneFromSwitchesMutationVariables>;
export const CurrentSceneForSwitchesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"CurrentSceneForSwitches"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"obsScenesCurrentChanged"}}]}}]} as unknown as DocumentNode<CurrentSceneForSwitchesSubscription, CurrentSceneForSwitchesSubscriptionVariables>;
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
export const ToggleCameraVisibilityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ToggleCameraVisibility"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"streamWebcamToggle"}}]}}]} as unknown as DocumentNode<ToggleCameraVisibilityMutation, ToggleCameraVisibilityMutationVariables>;
export const ToggleCameraBlurDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ToggleCameraBlur"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"streamWebcamToggleBlur"}}]}}]} as unknown as DocumentNode<ToggleCameraBlurMutation, ToggleCameraBlurMutationVariables>;
export const CameraVisibilityChangedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"CameraVisibilityChanged"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"streamWebcamChanged"}}]}}]} as unknown as DocumentNode<CameraVisibilityChangedSubscription, CameraVisibilityChangedSubscriptionVariables>;
export const CameraBlurChangedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"CameraBlurChanged"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"streamWebcamBlurChanged"}}]}}]} as unknown as DocumentNode<CameraBlurChangedSubscription, CameraBlurChangedSubscriptionVariables>;