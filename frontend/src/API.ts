/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateReminderInput = {
  id?: string | null,
  name: string,
};

export type ModelReminderConditionInput = {
  name?: ModelStringInput | null,
  and?: Array< ModelReminderConditionInput | null > | null,
  or?: Array< ModelReminderConditionInput | null > | null,
  not?: ModelReminderConditionInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type Reminder = {
  __typename: "Reminder",
  id?: string,
  name?: string,
  createdAt?: string,
  updatedAt?: string,
};

export type UpdateReminderInput = {
  id: string,
  name?: string | null,
};

export type DeleteReminderInput = {
  id: string,
};

export type ModelReminderFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  and?: Array< ModelReminderFilterInput | null > | null,
  or?: Array< ModelReminderFilterInput | null > | null,
  not?: ModelReminderFilterInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type ModelReminderConnection = {
  __typename: "ModelReminderConnection",
  items?:  Array<Reminder | null >,
  nextToken?: string | null,
};

export type CreateReminderMutationVariables = {
  input?: CreateReminderInput,
  condition?: ModelReminderConditionInput | null,
};

export type CreateReminderMutation = {
  createReminder?:  {
    __typename: "Reminder",
    id: string,
    name: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateReminderMutationVariables = {
  input?: UpdateReminderInput,
  condition?: ModelReminderConditionInput | null,
};

export type UpdateReminderMutation = {
  updateReminder?:  {
    __typename: "Reminder",
    id: string,
    name: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteReminderMutationVariables = {
  input?: DeleteReminderInput,
  condition?: ModelReminderConditionInput | null,
};

export type DeleteReminderMutation = {
  deleteReminder?:  {
    __typename: "Reminder",
    id: string,
    name: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type GetReminderQueryVariables = {
  id?: string,
};

export type GetReminderQuery = {
  getReminder?:  {
    __typename: "Reminder",
    id: string,
    name: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListRemindersQueryVariables = {
  filter?: ModelReminderFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListRemindersQuery = {
  listReminders?:  {
    __typename: "ModelReminderConnection",
    items:  Array< {
      __typename: "Reminder",
      id: string,
      name: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type OnCreateReminderSubscription = {
  onCreateReminder?:  {
    __typename: "Reminder",
    id: string,
    name: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateReminderSubscription = {
  onUpdateReminder?:  {
    __typename: "Reminder",
    id: string,
    name: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteReminderSubscription = {
  onDeleteReminder?:  {
    __typename: "Reminder",
    id: string,
    name: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};
