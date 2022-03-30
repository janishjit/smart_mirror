import { useContext } from "react";
import EmailsContext from "./EmailsContext";

const useEmails = () => {
  const { emails } = useContext(EmailsContext);
  return emails;
};

export default useEmails;
