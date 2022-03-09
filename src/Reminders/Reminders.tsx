import { EventType } from "../types";
import styles from "./Reminders.module.css";

type ReminderProps = { reminders: string[] };

const Reminders = ({ reminders }: ReminderProps) => {
  return <div className={ styles.container }>
    <div className={ [styles.underlined, "text"].join(" ") }>Reminders</div>
    <ul className={ ["text"].join(" ") }>
      { reminders.map((entry: string, index) =>
        <li key={ index }>
          { entry }
        </li>
      ) }
    </ul>
  </div>;
};

export default Reminders;