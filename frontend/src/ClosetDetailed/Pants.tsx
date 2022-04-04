import { Carousel } from "react-responsive-carousel";
import styles from "./ClosetDetailed.module.css";

type PantsProps = {
  pants: any;
};

const Pants = ({ pants }: PantsProps) => {
  return (
    <div onClick={ (e) => e.stopPropagation() }>
      <Carousel
        infiniteLoop
        swipeable emulateTouch axis="horizontal" showThumbs={ false } showArrows showIndicators={ false } showStatus={ false }>
        { pants.map((pant: string) =>
          <div className={ styles.imgContainer }>
            <img src={ pant } className={ styles.clothing } />
          </div>
        ) }
      </Carousel>
    </div>
  );
}

export default Pants;