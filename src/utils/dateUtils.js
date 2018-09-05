const DAY = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds

export const dayDiff = (start, end) => {
  return Math.round(Math.abs((start.getTime() - end.getTime()) / DAY));
};

export const isWeekend = date => {
  const day = date.getDay();
  return day === 6 || day === 0;
};

// returns total hours over day range
export const dateRangeHours = (start, end, weekdayTime, weekendTime) => {
  let hours = 0;
  for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
    hours += isWeekend(d) ? weekendTime : weekdayTime;
  }
  return hours;
};
