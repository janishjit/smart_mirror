import { useEffect, useState } from "react";
import styles from "./ClosetDetailed.module.css";
import fetchClothing from "./fetchClothing";
import Pants from "./Pants";
import Shirts from "./Shirts";

type ClosetDetailedProps = {};

const ClosetDetailed = (props: ClosetDetailedProps) => {
  const [clothing, setClothing] = useState<any>({ pants: [], shirts: [] });
  useEffect(() => {
    fetchClothing().then((fetchedClothing) => {
      setClothing(fetchedClothing);
    });
  }, []);
  return (
    <div className={ styles.root }>
      <Shirts shirts={ [...clothing.shirts, ...clothing.shirts] } />
      <Pants pants={ [...clothing.pants, ...clothing.pants] } />
    </div>
  );
}

export default ClosetDetailed;