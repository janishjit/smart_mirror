const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secondsLeft = seconds % 60;
  return `${minutes}:${secondsLeft < 10 ? "0" : ""}${secondsLeft}`;
};

const getMinutesFromDuration = (durationInSeconds: number) => {
  const minutes = Math.ceil(durationInSeconds / 60);
  return minutes;
};

const getLeaveAt = (
  arrivalTimeMilliseconds: number,
  durationInDeciSeconds: number
) => {
  let durationInMilliseconds = durationInDeciSeconds * 10e2;
  if (arrivalTimeMilliseconds < Date.now() + durationInMilliseconds) return 0;
  return new Date(arrivalTimeMilliseconds - durationInMilliseconds);
};

export { getLeaveAt, getMinutesFromDuration };

export default formatTime;
