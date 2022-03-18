import { useContext } from "react";
import RemindersContext from "./RemindersContext";

const useReminders = () => {
  const { reminders } = useContext(RemindersContext);
  return reminders;
};

export default useReminders;
