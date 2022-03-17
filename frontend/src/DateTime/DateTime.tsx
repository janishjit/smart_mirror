import { useEffect, useState } from "react";
import styles from "./DateTime.module.css";

const DateTime = () => {
  const [date, setDate] = useState(new Date());
  useEffect(() => {
    setInterval(() => setDate(new Date()), 5000);
  }, []);
  return (
    <div className={ [styles.container].join(" ") }>
      <div className={ [styles.date, "text"].join(" ") }>{ date.toLocaleString('en-US', { hour: 'numeric', hour12: true, minute: "numeric" }) }</div>
      <p className={ [styles.time, "text"].join(" ") }>{ date.toLocaleString('default', { month: 'long', day: "numeric", year: "numeric" },) }</p>
    </div>
  );
};

export default DateTime;
