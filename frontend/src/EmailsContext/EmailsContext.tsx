import React, { ReactNode, useEffect, useState } from "react";
import getEmails from "../Emails/getEmails";

const EmailsContext = React.createContext(
  {} as any
);

export const EmailsProvider = (props: { children?: ReactNode }) => {
  const { children } = props;
  const [emails, _setEmails] = useState<any>([]);
  function setEmails(emailsList: any) {
    _setEmails(emailsList);
  }

  useEffect(() => {
    getEmails().then(setEmails);
  }, [])

  return (
    <EmailsContext.Provider value={ { emails, setEmails } }>
      { children }
    </EmailsContext.Provider>
  );
};

export default EmailsContext;
