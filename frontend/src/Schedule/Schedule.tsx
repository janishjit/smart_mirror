import { EventType } from "../types";
import styles from "./Schedule.module.css";
import { SyntheticEvent, useEffect, useState } from "react";
import { getAuthState, getUpcomingEvents, signIn } from "./GoogleAuth";
import { format, formatDistance, formatRelative, subDays } from 'date-fns'
import useEvents from "../EventsContext/useEvents";

type ScheduleProps = {
  schedule: EventType[];
};

const formatDateTime = (dateTime: string) => {
  let date = new Date(dateTime);
  return format(date, 'h:mm a');
}

const Schedule = ({ schedule }: ScheduleProps) => {
  const events = useEvents();

  return <div className={ styles.container }>
    <div className={ [styles.underlined, "text"].join(" ") }>My Schedule</div>
    <ul className={ ["text"].join(" ") }>
      { events.map((entry: any, index: number) =>
        <li key={ index }>{ formatDateTime(entry.event.start.dateTime) }: { entry?.event.summary }</li>
      ) }
    </ul>
  </div>;
};

export default Schedule;
