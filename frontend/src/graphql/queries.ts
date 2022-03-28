/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getClothingPhotos = /* GraphQL */ `
  query GetClothingPhotos($itemType: String) {
    getClothingPhotos(itemType: $itemType) {
      photos
    }
  }
`;
export const getReminder = /* GraphQL */ `
  query GetReminder($id: ID!) {
    getReminder(id: $id) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
export const listReminders = /* GraphQL */ `
  query ListReminders(
    $filter: ModelReminderFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listReminders(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
