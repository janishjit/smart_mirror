import styles from "./Welcome.module.css";

type WelcomeProps = { name: string; quote: string };
const Welcome = ({ name, quote }: WelcomeProps) => {
  return (
    <>
      <div className={ [styles.hi, "text"].join(" ") }>Hi, <strong>{ name }</strong></div>
    </>
  );
};

export default Welcome;
