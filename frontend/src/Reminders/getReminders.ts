import { GraphQLResult } from "@aws-amplify/api";
import { API } from "aws-amplify";
import { ListRemindersQuery, ListRemindersQueryVariables } from "../API";
import { listReminders } from "../graphql/queries";

const getReminders = async (listOptions?: ListRemindersQueryVariables) => {
  const res = (await API.graphql({
    query: listReminders,
    variables: listOptions,
    authMode: "API_KEY",
  })) as GraphQLResult<ListRemindersQuery>;

  if (res.data?.listReminders) {
    return res.data.listReminders.items;
  }

  throw new Error(`Failed to get reminders`);
};

export default getReminders;
