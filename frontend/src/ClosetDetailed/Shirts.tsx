import { Carousel } from "react-responsive-carousel";
import styles from "./ClosetDetailed.module.css";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

type ShirtsProps = {
  shirts: any;
};

const Shirts = ({ shirts }: ShirtsProps) => {
  return (
    <div onClick={ (e) => e.stopPropagation() }>
      <Carousel
        infiniteLoop
        swipeable
        emulateTouch
        axis="horizontal"
        showThumbs={ false }
        showArrows
        showIndicators={ false }
        showStatus={ false }
      >
        { shirts.map((shirt: string) => (
          <div>
            <img src={ shirt } className={ styles.clothing } />
          </div>
        )) }
      </Carousel>
    </div>
  );
};

export default Shirts;
