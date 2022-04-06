const weatherAPIEndpoint = `http://api.weatherapi.com/v1/forecast.json?key=${process.env.REACT_APP_WEATHER_API_KEY}&q=Vancouver&days=1&aqi=no&alerts=no`;

const getWeather = async () => {
  const res = await fetch(weatherAPIEndpoint);
  if (!res.ok) throw new Error(`Failed to get weather data: ${res}`);

  let data = await res.json();
  let today = data.forecast.forecastday[0].day;
  const { mintemp_c: low, maxtemp_c: high, avgtemp_c: avg } = today;

  let condition: string = today.condition.text;
  condition = toTitleCase(condition);
  let icon: string = today.condition.icon;
  icon = icon.substring(2, icon.length);
  icon = "http://" + icon;
  return {
    low,
    high,
    avg,
    condition,
    icon,
  };
};

function toTitleCase(str: string) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

export default getWeather;
