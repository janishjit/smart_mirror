import styles from "./DateTime.module.css";

type DateTimeProps = { date: string; time: string };
const DateTime = ({ date, time }: DateTimeProps) => {
  return (
    <>
      <div className={ [styles.date, "text"].join(" ") }>{ date }</div>
      <p className={ [styles.time, "text"].join(" ") }>{ time }</p>
    </>
  );
};

export default DateTime;
