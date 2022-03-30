import styles from "./Closet.module.css";
import { ReactComponent as Shirt } from "./shirt.svg"
import { ReactComponent as Pants } from "./pants.svg"
type ClosetProps = {
  onClickFocus: () => void;
};

const Closet = ({ onClickFocus }: ClosetProps) => {
  return (
    <div className={ styles.root } onClick={ onClickFocus }>
      <Shirt width={ 90 } height={ 120 } />
      <Pants width={ 90 } height={ 120 } />
    </div>
  );
}

export default Closet;