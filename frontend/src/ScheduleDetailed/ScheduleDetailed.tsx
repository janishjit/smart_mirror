import useEvents from "../EventsContext/useEvents";
import { GoogleEvent } from "../types";
import Event from "./Event";
import styles from "./ScheduleDetailed.module.css";
type ScheduleDetailedProps = {};

const onSameDay = (first: Date, second: Date) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

const ScheduleDetailed = (props: ScheduleDetailedProps) => {
  const events = useEvents();
  const today = new Date(Date.now());
  const filteredEvents = events.filter((event: GoogleEvent) => {
    return onSameDay(new Date(event.when), today);
  });

  return (
    <div className={ styles.root } onClick={ (event) => { event.stopPropagation() } }>
      { filteredEvents.map((event: GoogleEvent) => {
        return <Event event={ event } />
      }) }
      <p className={ styles.p }>
        { "... and then you're done!" }
      </p>
    </div>
  );
}

export default ScheduleDetailed;