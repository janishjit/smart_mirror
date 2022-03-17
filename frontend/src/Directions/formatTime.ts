const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secondsLeft = seconds % 60;
  return `${minutes}:${secondsLeft < 10 ? "0" : ""}${secondsLeft}`;
};

const getMinutesFromDuration = (durationInSeconds: number) => {
  const minutes = Math.ceil(durationInSeconds / 60);
  return minutes;
};

const getLeaveAt = (arrivalTime: number, durationInSeconds: number) => {
  if (arrivalTime - durationInSeconds * 10e9) return new Date(Date.now());
  return new Date(arrivalTime - durationInSeconds * 10e9);
};

export { getLeaveAt, getMinutesFromDuration };

export default formatTime;
