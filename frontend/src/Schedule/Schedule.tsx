import { EventType } from "../types";
import styles from "./Schedule.module.css";
type ScheduleProps = {
  schedule: EventType[];
};

const Schedule = ({ schedule }: ScheduleProps) => {
  return <div className={ styles.container }>
    <div className={ [styles.underlined, "text"].join(" ") }>My Schedule</div>
    <ul className={ ["text"].join(" ") }>
      { schedule.map((entry: EventType, index: number) =>
        <li key={ index }>
          { entry.time }: { entry.event }
        </li>
      ) }
    </ul>
  </div>;
};

export default Schedule;
