import { useContext } from "react";
import EventsContext from "./EventsContext";

const useEvents = () => {
  const { events } = useContext(EventsContext);
  return events;
};

export default useEvents;
