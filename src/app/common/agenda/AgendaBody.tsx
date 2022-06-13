import moment from "moment";
import React, { useState } from "react";
import AgendaCell from "./AgendaCell";
import { IAgendaColumn, IAgenda, flexCenterd } from "./utils";

type AgendaBodyProps<T extends IAgenda> = {
  timeHours: moment.Moment[];
  columns: IAgendaColumn[];
  events: T[];
  cellHeight?: number;
  selectedDate: moment.Moment;
  selectedDates: moment.Moment[];
  calendarType: "date" | "week";
  timeFormat: "HH:mm" | "hh:mm a";
  render: (event?: T) => React.ReactNode;
  onClick?: (date: moment.Moment, event?: T, column?: IAgendaColumn) => void;
  onDropEvent?: (date: moment.Moment, event?: T, column?: IAgendaColumn) => void;
};

const AgendaBody = <T extends IAgenda>({
  timeHours,
  columns,
  events,
  cellHeight,
  selectedDate,
  selectedDates,
  calendarType,
  timeFormat,
  render,
  onClick,
  onDropEvent,
}: AgendaBodyProps<T>) => {
  const [draggingEvent, setDragginEvent] = useState<T>();

  return (
    <tbody>
      {timeHours.map((hour) => {
        return (
          <tr draggable={false} key={hour.format("HH:mm")}>
            <td style={{ height: cellHeight ? cellHeight : "unset" }}>
              <div style={{ width: timeFormat === "HH:mm" ? 60 : 75, ...flexCenterd }}>
                {hour.format(timeFormat)}
              </div>
            </td>
            {calendarType === "date"
              ? columns.map((col) => {
                  const time = moment(
                    `${selectedDate.format("DD/MM/YYYY")} ${hour.format("HH:mm")}`,
                    "DD/MM/YYYY HH:mm"
                  );
                  const event = events.find((e) => time.isSame(e.date) && e.externalId === col.id);
                  return (
                    <td key={col.id} draggable={false}>
                      <AgendaCell
                        time={time}
                        event={event}
                        column={col}
                        draggingEvent={draggingEvent}
                        setDragginEvent={setDragginEvent}
                        render={render}
                        onClick={onClick}
                        onDropEvent={onDropEvent}
                      />
                    </td>
                  );
                })
              : selectedDates.map((date) => {
                  const time = moment(
                    `${date.format("DD/MM/YYYY")} ${hour.format("HH:mm")}`,
                    "DD/MM/YYYY HH:mm"
                  );
                  const event = events.find((e) => time.isSame(e.date));
                  return (
                    <td key={date.toISOString()}>
                      <AgendaCell
                        time={time}
                        event={event}
                        draggingEvent={draggingEvent}
                        setDragginEvent={setDragginEvent}
                        render={render}
                        onClick={onClick}
                        onDropEvent={onDropEvent}
                      />
                    </td>
                  );
                })}
          </tr>
        );
      })}
    </tbody>
  );
};

export default AgendaBody;
