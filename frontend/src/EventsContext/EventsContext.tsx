import React, { ReactNode, useEffect, useState } from "react";
import { getUpcomingEvents } from "../Schedule/GoogleAuth";

const EventsContext = React.createContext(
  {} as any
);

export const EventsProvider = (props: { children?: ReactNode }) => {
  const { children } = props;
  const [events, _setEvents] = useState<any>([]);
  function setEvents(eventsList: any) {
    _setEvents(eventsList);
  }

  useEffect(() => {
    getUpcomingEvents().then(setEvents);
  }, [])

  return (
    <EventsContext.Provider value={ { events, setEvents } }>
      { children }
    </EventsContext.Provider>
  );
};

export default EventsContext;
