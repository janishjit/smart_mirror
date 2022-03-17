import styles from "./Welcome.module.css";

type WelcomeProps = { name: string; quote: string };
const Welcome = ({ name, quote }: WelcomeProps) => {
  return (
    <>
      <div className={ [styles.hi, "text"].join(" ") }>Hi,</div>
      <div className={ [styles.name, "text"].join(" ") }>{ name }</div>
      <p className={ [styles.quote, "text"].join(" ") }>{ quote }</p>
    </>
  );
};

export default Welcome;
