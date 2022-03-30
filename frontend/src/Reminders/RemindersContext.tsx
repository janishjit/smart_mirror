import React, { ReactNode, useEffect, useState } from "react";
import { getUpcomingEvents } from "../Schedule/getUpcomingEvents";
import getReminders from "./getReminders";

const RemindersContext = React.createContext(
  {} as any
);

export const RemindersProvider = (props: { children?: ReactNode }) => {
  const { children } = props;
  const [reminders, _setReminders] = useState<any>([]);
  function setReminders(remindersList: any) {
    _setReminders(remindersList);
  }

  useEffect(() => {
    getReminders().then(setReminders);
  }, [])

  return (
    <RemindersContext.Provider value={ { reminders, setReminders } }>
      { children }
    </RemindersContext.Provider>
  );
};

export default RemindersContext;
