import styles from "./Speech.module.css";
import socket from "../Socket"
import { useEffect, useState } from "react";
type SpeechProps = {};
const Speech = (props: SpeechProps) => {
  const [voice, setVoice] = useState<string[]>([]);
  useEffect(() => {
    socket.on("voice", (message) => {
      console.log(message);

      setVoice((old) => [...old, message.data]);
      setTimeout(() => {
        setVoice(old => old.slice(1, old.length));
      }, 10000);
    })
  }, [])
  return (
    <div className={ styles.main }>
      { voice.map(fragment => <p className={ styles.fading }>{ fragment }</p>) }
    </div>
  );
}

export default Speech;