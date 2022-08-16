import React, { FC } from "react";
import { Typography } from "antd";
import { flexCenterd, IAgendaColumn } from "./utils";

const { Text } = Typography;

type AgendaHeaderProps = {
  columns: IAgendaColumn[];
  selectedDate: moment.Moment;
  selectedDates: moment.Moment[];
  calendarType: "date" | "week";
  renderDate?: (date: moment.Moment, column?: IAgendaColumn) => React.ReactNode;
  renderHeader?: (date: moment.Moment, column?: IAgendaColumn) => React.ReactNode;
};

const AgendaHeader = ({
  columns,
  selectedDate,
  selectedDates,
  calendarType,
  renderDate,
  renderHeader,
}: AgendaHeaderProps) => {
  return (
    <thead>
      <tr>
        <th></th>
        {calendarType === "date"
          ? columns.map((x) => (
              <th key={x.id}>
                {renderHeader == null ? <Header key={x.id}>{x.title}</Header> : renderHeader(selectedDate, x)}
              </th>
            ))
          : selectedDates.map((x) => (
              <th key={x.toISOString()}>
                {renderHeader == null ? (
                  <Header key={x.toISOString()}>{x.format("dddd")}</Header>
                ) : (
                  renderHeader(x, undefined)
                )}
              </th>
            ))}
      </tr>
      <tr>
        <th></th>
        {calendarType === "date"
          ? columns.map((x) => (
              <th key={x.id}>
                {renderDate == null ? (
                  <DateInfo key={x.id}>{selectedDate.format("DD/MM/YYYY")}</DateInfo>
                ) : (
                  renderDate(selectedDate, x)
                )}
              </th>
            ))
          : selectedDates.map((x) => (
              <th key={x.toISOString()}>
                {renderDate == null ? (
                  <DateInfo key={x.toISOString()}>{x.format("DD/MM/YYYY")}</DateInfo>
                ) : (
                  renderDate(x, undefined)
                )}
              </th>
            ))}
      </tr>
    </thead>
  );
};

export default AgendaHeader;

type ChildrenProps = {
  children?: React.ReactNode;
};

const Header: FC<ChildrenProps> = ({ children }) => {
  return (
    <div style={{ width: 180 }}>
      <div style={{ padding: "0 5px", height: 30 }}>
        <div className="agenda-header-cell" style={{ borderRadius: 2, ...flexCenterd }}>
          <Text strong>{children}</Text>
        </div>
      </div>
    </div>
  );
};

const DateInfo: FC<ChildrenProps> = ({ children }) => {
  return (
    <div style={{ width: 180 }}>
      <div style={{ padding: "0 5px", height: 25 }}>
        <div style={flexCenterd}>
          <Text strong italic>
            {children}
          </Text>
        </div>
      </div>
    </div>
  );
};
