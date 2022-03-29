import styles from "./Emails.module.css";
import { ReactComponent as Gmail } from "./gmail.svg";
type EmailsProps = {};

const Emails = (props: EmailsProps) => {
  return (
    <div className={ styles.root }>
      <Gmail />
      <div className={ styles.badge }>1</div>
    </div>
  );
}

export default Emails;