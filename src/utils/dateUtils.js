const DAY = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
const WEEK = DAY * 7;

export const dayDiff = (start, end) => {
  return Math.round(Math.abs((start.getTime() - end.getTime()) / DAY));
};

export const isWeekend = date => {
  const day = date.getDay();
  return day === 6 || day === 0;
};
