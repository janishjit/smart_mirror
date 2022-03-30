import { Loader } from "@mantine/core";
import { useEffect, useState } from "react";
import useEmails from "../EmailsContext/useEmails";
import { GoogleMessage } from "../types";
import Email from "./Email";
import getEmailDetails from "./getEmailDetails";
import styles from "./EmailsDetailed.module.css";
type EmailsDetailedProps = {};

const EmailsDetailed = (props: EmailsDetailedProps) => {
  const emailIds = useEmails();
  const [loaded, setLoaded] = useState(false);
  const [emails, setEmails] = useState<GoogleMessage[]>([]);
  useEffect(() => {
    getEmailDetails(emailIds).then((emailDetails) => {
      setEmails(emailDetails);
      setLoaded(true);
    })
  }, [emailIds]);

  if (!loaded) {
    return <Loader />
  }

  if (emails.length === 0) {
    return <div className={ styles.root } onClick={ (event) => { event.stopPropagation() } }>
      <p className={ styles.p }>You have no unread emails!</p>
    </div>
  }
  return (
    <div className={ styles.root } onClick={ (event) => { event.stopPropagation() } }>
      { emails.map((email: GoogleMessage) => <Email email={ email } />) }
    </div>
  );
}

export default EmailsDetailed;