function generateDateWithTimestamp(timestamp: number) {
  return new Date(timestamp).toLocaleDateString();
}

function generateTimeWithTimestamp(timestamp: number) {
  const date = new Date(timestamp);
  const hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  const minutes =
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  return `${hours}:${minutes}`;
}

function generateDayWeekWithTimestamp(timestamp: number) {
  const option: object = { weekday: "short" };
  const locale = "pt-br";
  return new Date(timestamp)
    .toLocaleDateString(locale, option)
    .toUpperCase()
    .slice(0, -1);
}

function generateTimestampWithDateAndTime(date: Date, time: Date) {
  const day = date.getDay();
  const month = date.getMonth();
  const year = date.getFullYear();
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const timestamp = new Date(year, month, day, hours, minutes, seconds);
  return timestamp;
}

function generateTotalHours(initial: number, final: number) {
  let hours = Math.trunc((final - initial) / 60 / 60 / 1000);
  let minutes = Math.trunc(((final - initial) / 60 / 1000) % 60);
  if (hours > 60) {
    minutes = hours % 60;
    hours = Math.trunc(hours / 60);
  }
  return `${hours < 10 ? "0" + hours : hours}:${
    minutes < 10 ? "0" + minutes : minutes
  }`;
}

function generateAdjustmentWithNumberInMilliseconds(number: number) {
  if (!number) {
    return "0";
  }
  let hours = Math.trunc(number / 60 / 60 / 60 / 1000);
  let minutes = Math.trunc((number / 60 / 60 / 1000) % 60);
  if (hours > 60) {
    minutes = hours % 60;
    hours = Math.trunc(hours / 60);
  }
  return `${hours < 10 ? "0" + hours : hours}:${
    minutes < 10 ? "0" + minutes : minutes
  }`;
}

function generateTotalHoursWithAdjustment(
  initial: number,
  final: number,
  adjustment: number
) {
  if (!adjustment) {
    return generateTotalHours(initial, final);
  } else {
    return generateTotalHours(initial, final + adjustment / 60);
  }
}

export {
  generateDateWithTimestamp,
  generateTimeWithTimestamp,
  generateDayWeekWithTimestamp,
  generateTimestampWithDateAndTime,
  generateTotalHours,
  generateAdjustmentWithNumberInMilliseconds,
  generateTotalHoursWithAdjustment,
};