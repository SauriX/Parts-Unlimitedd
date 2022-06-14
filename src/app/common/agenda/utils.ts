import moment from "moment";

export interface IAgenda {
  id: number | string;
  externalId: number | string;
  date: moment.Moment;
}

export interface IAgendaColumn {
  id: number | string;
  title: string;
}

export enum Days {
  Sunday,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
}

export const flexCenterd = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "inherit",
};

export const getTimeHours = (
  interval: moment.Moment,
  start: moment.Moment,
  end: moment.Moment
): moment.Moment[] => {
  const startTime = moment.utc(moment.duration(start.format("HH:mm")).asMilliseconds());
  const endTime = moment.utc(moment.duration(end.format("HH:mm")).asMilliseconds());

  const times: moment.Moment[] = [];

  times.push(startTime);

  let max = moment.max(times);
  while (max.isSameOrBefore(endTime)) {
    const start = moment.duration(max.format("HH:mm"));
    const inter = moment.duration(interval.format("HH:mm"));

    start.add(inter);

    const newTime = moment.utc(start.asMilliseconds());

    if (newTime.isSameOrBefore(endTime)) {
      times.push(newTime);
    }

    max = newTime;
  }

  return times;
};

export const getWeekDates = (startDate: moment.Moment, endDate: moment.Moment, excludeDays: Days[]) => {
  const dates: moment.Moment[] = [startDate];

  let max = moment.max(dates);
  while (max.isSameOrBefore(endDate)) {
    const start = max.clone();
    start.add(1, "day");

    const newDate = start;
    if (newDate.isSameOrBefore(endDate) && !excludeDays.includes(newDate.day())) {
      dates.push(newDate);
    }

    max = newDate;
  }

  return dates;
};

export const getCellClassName = (
  date: moment.Moment,
  calendarType: "date" | "week",
  selectedDate: moment.Moment,
  selectedDates: moment.Moment[],
  excludeDays: Days[]
) => {
  let className = "agenda-calendar-day";

  if (
    (calendarType === "date" && selectedDate.isSame(date, "day")) ||
    (calendarType === "week" &&
      date.isBetween(selectedDates[0], selectedDates[6 - excludeDays.length], "day", "[]"))
  ) {
    className += " selected-day";
  }

  if (date.isSame(moment(), "day")) {
    className += " today";
  }

  return className;
};
