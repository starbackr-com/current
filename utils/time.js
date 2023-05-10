export function getAge(timestamp) {
  const now = new Date();
  const timePassedInMins = Math.floor(
    (now - new Date(timestamp * 1000)) / 1000 / 60,
  );

  if (timePassedInMins < 60) {
    return `${timePassedInMins}min ago`;
  }
  if (timePassedInMins >= 60 && timePassedInMins < 1440) {
    return `${Math.floor(timePassedInMins / 60)}h ago`;
  }
  if (timePassedInMins >= 1440 && timePassedInMins < 10080) {
    return `${Math.floor(timePassedInMins / 1440)}d ago`;
  }
  return `on ${new Date(timestamp * 1000).toLocaleDateString()}`;
}

export function getHourAndMinute(unixInSeconds) {
  const timePassedInMins = Math.floor(
    (now - new Date(unixInSeconds * 1000)) / 1000 / 60,
  );
  if (timePassedInMins > 10080)
      return `on ${new Date(timestamp * 1000).toLocaleDateString()}`;
  const now = new Date();
  const date = new Date(unixInSeconds * 1000);
  let day = date.getDay();
  if (now.getDay() - day === 0) day = 7;
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'];
  return `${dayNames[day]} ${date.getHours()}:${date.getMinutes()<10?'0'+date.getMinutes() :date.getMinutes()}`;
}
