import { useEffect, useState } from "react";
import getWeather from "./getWeather";
import styles from "./Weather.module.css";
type WeatherProps = {};

type WeatherData = {
  low: number;
  high: number;
  avg: number;
  condition: string;
  icon: string;
}

const LoadingWeather = () => {
  return null;
}

const Weather = (props: WeatherProps) => {
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        let fetchedData = await getWeather();
        setWeatherData(fetchedData);
      } catch (e) {
        console.error(e);
      }
    };
    fetchWeather().then(() => setLoading(false));
  }, []);

  if (loading || !weatherData) return <LoadingWeather />

  return (
    <div className={ styles.container }>
      <div className={ styles.condition }>
        <img src={ weatherData.icon }
          width={ 60 }
          height={ 60 }
          alt={ weatherData.condition + " icon" } />
        <p className={ [styles.conditionText, "text"].join(" ") }>{ weatherData.condition }</p>
      </div>
      <div className={ styles.avg }>
        <h3 className={ [styles.avgText, "text"].join(" ") }>{ weatherData.avg } °C</h3>
        <div className={ styles.range }>
          <h3 className={ [styles.rangeText, "text"].join(" ") }>↓{ weatherData.low }°</h3>
          <h3 className={ [styles.rangeText, "text"].join(" ") }>↑{ weatherData.high }°</h3>
        </div>
      </div>
    </div>
  );
}

export default Weather;