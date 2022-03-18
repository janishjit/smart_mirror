import { Reminder } from "../API";
import { EventType } from "../types";
import styles from "./Reminders.module.css";
import useReminders from "./useReminders";

type ReminderProps = {};

const Reminders = ({ }: ReminderProps) => {
  const reminders = useReminders();
  if (!reminders) {
    return <div>loading</div>
  }
  if (!reminders.length) {
    return <div>Add some reminders!</div>
  }
  return <div className={ styles.container }>
    <div className={ [styles.underlined, "text"].join(" ") }>Reminders</div>
    <ul className={ ["text"].join(" ") }>
      { reminders.map((entry: Reminder, index: number) =>
        <li key={ index }>
          { entry.name }
        </li>
      ) }
    </ul>
  </div>;
};

export default Reminders;