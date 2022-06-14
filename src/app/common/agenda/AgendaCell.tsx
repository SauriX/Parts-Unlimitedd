import { useState } from "react";
import { IAgenda, IAgendaColumn } from "./utils";

type AgendaCellProps<T extends IAgenda> = {
  time: moment.Moment;
  event?: T;
  column?: IAgendaColumn;
  draggingEvent: T | undefined;
  setDragginEvent: React.Dispatch<React.SetStateAction<T | undefined>>;
  render: (event: T) => React.ReactNode;
  onClick?: (date: moment.Moment, event?: T, column?: IAgendaColumn) => void;
  onDropEvent?: (date: moment.Moment, event?: T, column?: IAgendaColumn) => void;
};

const AgendaCell = <T extends IAgenda>({
  time,
  event,
  column,
  draggingEvent,
  setDragginEvent,
  render,
  onClick,
  onDropEvent,
}: AgendaCellProps<T>) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      draggable={!!event}
      onClick={() => {
        if (onClick) {
          onClick(time, event, column);
        }
      }}
      onDragStart={() => {
        setDragginEvent(event);
      }}
      onDragOver={(e) => {
        return event ? false : e.preventDefault();
      }}
      onDragEnter={() => {
        if (!event) {
          setHovered(true);
        }
      }}
      onDragLeave={() => {
        setHovered(false);
      }}
      onDrop={() => {
        if (event) return false;
        setHovered(false);
        if (onDropEvent) {
          onDropEvent(time, draggingEvent, column);
          setDragginEvent(undefined);
        }
      }}
      style={{
        backgroundColor: hovered ? "#f0f0f0" : "white",
        height: "100%",
      }}
    >
      {!event ? <div></div> : render(event)}
    </div>
  );
};

export default AgendaCell;
