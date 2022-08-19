import moment from "moment";
import { useState, useEffect } from "react";
import AgendaBody from "./AgendaBody";
import AgendaDatePicker from "./AgendaDatePicker";
import AgendaHeader from "./AgendaHeader";
import { IAgenda, IAgendaColumn, Days, getTimeHours, getWeekDates } from "./utils";
import "./agenda.less";

type AgendaProps<T extends IAgenda> = {
  startTime: moment.Moment;
  endTime: moment.Moment;
  interval: moment.Moment;
  columns: IAgendaColumn[];
  events: T[];
  excludeDays?: Days[];
  cellHeight?: number;
  calendarHeight?: number | string;
  defaultType?: "date" | "week";
  timeFormat?: "HH:mm" | "hh:mm a";
  render: (event?: T) => React.ReactNode;
  renderDate?: (date: moment.Moment, column?: IAgendaColumn) => React.ReactNode;
  renderHeader?: (date: moment.Moment, column?: IAgendaColumn) => React.ReactNode;
  onTypeChange?: (type: "date" | "week") => void;
  onClick?: (date: moment.Moment, event?: T, column?: IAgendaColumn) => void;
  onDropEvent?: (date: moment.Moment, event?: T, column?: IAgendaColumn) => void;
};

const Agenda = <T extends IAgenda>({
  startTime,
  endTime,
  interval,
  columns,
  events,
  excludeDays,
  cellHeight,
  calendarHeight,
  defaultType,
  timeFormat,
  render,
  renderDate,
  renderHeader,
  onTypeChange,
  onClick,
  onDropEvent,
}: AgendaProps<T>) => {
  const timeHours = getTimeHours(interval, startTime, endTime);

  const [calendarType, setCalendarType] = useState<"week" | "date">(defaultType ?? "date");
  const [selectedDate, setSelectedDate] = useState<moment.Moment>(moment());
  const [selectedDates, setSelectedDates] = useState<moment.Moment[]>([]);

  useEffect(() => {
    const startDate = selectedDate.clone().startOf("week");
    const endDate = selectedDate.clone().endOf("week");

    const dates = getWeekDates(startDate, endDate, excludeDays ?? []);
    console.log(dates);
    setSelectedDates(dates);
  }, [calendarType, excludeDays, selectedDate]);

  if (selectedDates.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "row", alignItems: "start" }}>
      <AgendaDatePicker
        calendarType={calendarType}
        excludeDays={excludeDays ?? []}
        selectedDate={selectedDate}
        selectedDates={selectedDates}
        setCalendarType={setCalendarType}
        setSelectedDate={setSelectedDate}
        onTypeChange={onTypeChange}
      />
      <div className="agenda-table" style={{ height: calendarHeight, overflow: "auto" }}>
        <table>
          <AgendaHeader
            columns={columns}
            selectedDate={selectedDate}
            selectedDates={selectedDates}
            calendarType={calendarType}
            renderDate={renderDate}
            renderHeader={renderHeader}
          />
          <AgendaBody
            timeHours={timeHours}
            columns={columns}
            events={events}
            cellHeight={cellHeight}
            selectedDate={selectedDate}
            selectedDates={selectedDates}
            calendarType={calendarType}
            timeFormat={timeFormat ?? "HH:mm"}
            render={render}
            onClick={onClick}
            onDropEvent={onDropEvent}
          />
        </table>
      </div>
    </div>
  );
};

export default Agenda;
