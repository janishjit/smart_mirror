const getEmails = async () => {
  // @ts-ignore
  let response = await gapi.client.gmail.users.messages.list({
    userId: "me",
    q: "is:unread",
    maxResults: 10,
  });

  return response.result;
};

export default getEmails;
