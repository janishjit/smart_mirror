import styles from "./Schedule.module.css";
import { format } from 'date-fns'
import useEvents from "../EventsContext/useEvents";
import { ActionIcon } from '@mantine/core';
import { Focus2, ExternalLink } from 'tabler-icons-react';
import { GoogleEvent } from "../types";

type ScheduleProps = {
  onClickFocus: () => void;
};

export const formatDateTime = (dateTime: string) => {
  let date = new Date(dateTime);
  return format(date, 'h:mm a');
}

const Schedule = ({ onClickFocus }: ScheduleProps) => {
  const events = useEvents();

  return <div className={ styles.container }>
    <ActionIcon
      classNames={ {
        root: styles.iconButton
      } }
      onClick={ onClickFocus }>
      <ExternalLink color="white" />
    </ActionIcon>
    <div className={ [styles.underlined, "text"].join(" ") }>My Schedule</div>
    <ul className={ ["text"].join(" ") }>
      { events.map((entry: GoogleEvent, index: number) =>
        <li key={ index }>{ formatDateTime(entry.event.start.dateTime) }: { entry?.event.summary }</li>
      ) }
    </ul>
  </div>;
};

export default Schedule;
