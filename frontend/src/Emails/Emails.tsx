import useEmails from "../EmailsContext/useEmails";
import styles from "./Emails.module.css";
import { ReactComponent as Gmail } from "./gmail.svg";
type EmailsProps = {
  onClickFocus: () => void;
};

const Emails = ({ onClickFocus }: EmailsProps) => {
  const emails = useEmails();

  const numberOfEmails = emails.resultSizeEstimate;

  return (
    <div className={ styles.root } onClick={ onClickFocus }>
      <Gmail style={ { width: "100%", height: "100%" } } />
      { numberOfEmails > 0 && <div className={ styles.badge }>{ numberOfEmails }</div> }
    </div>
  );
}

export default Emails;