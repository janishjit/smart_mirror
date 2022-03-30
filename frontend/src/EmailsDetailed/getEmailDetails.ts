import { GoogleMessage } from "../types";

const getEmailDetails = async (messages: any) => {
  let emails = messages.messages;
  if (!emails || emails.length == 0) return [];
  const emailPromises = [];
  for (let i = 0; i < emails.length; i++) {
    // @ts-ignore
    let currEmail = gapi.client.gmail.users.messages.get({
      userId: "me",
      id: emails[i].id,
    });
    emailPromises.push(currEmail);
  }

  let emailDetails = await Promise.all(emailPromises);
  console.log(emailDetails);

  return emailDetails as GoogleMessage[];
};

export default getEmailDetails;
