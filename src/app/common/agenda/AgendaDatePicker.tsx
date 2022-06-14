import { Calendar, Col, Radio, Row, Select } from "antd";
import moment from "moment";
import React from "react";
import { Days, getCellClassName } from "./utils";

type HeaderRender<DateType> = (config: {
  value: DateType;
  onChange: (date: DateType) => void;
}) => React.ReactNode;

type AgendaDatePickerProps = {
  calendarType: "date" | "week";
  excludeDays: Days[];
  selectedDate: moment.Moment;
  selectedDates: moment.Moment[];
  setCalendarType: React.Dispatch<React.SetStateAction<"date" | "week">>;
  setSelectedDate: React.Dispatch<React.SetStateAction<moment.Moment>>;
  onTypeChange?: (type: "date" | "week") => void;
};

const AgendaDatePicker = ({
  calendarType,
  excludeDays,
  selectedDate,
  selectedDates,
  setCalendarType,
  setSelectedDate,
  onTypeChange,
}: AgendaDatePickerProps) => {
  const disabledDate = (current: moment.Moment) => {
    return excludeDays.includes(current.day());
  };

  const headerRender: HeaderRender<moment.Moment> = ({ value, onChange }) => {
    const start = 0;
    const end = 12;
    const monthOptions = [];

    const current = value.clone();
    const localeData = value.localeData();
    const months = [];
    for (let i = 0; i < 12; i++) {
      current.month(i);
      months.push(localeData.monthsShort(current));
    }

    for (let index = start; index < end; index++) {
      monthOptions.push(
        <Select.Option className="month-item" key={`${index}`}>
          {months[index]}
        </Select.Option>
      );
    }
    const month = value.month();

    const year = value.year();
    const options = [];
    for (let i = year - 10; i < year + 10; i += 1) {
      options.push(
        <Select.Option key={i} value={i} className="year-item">
          {i}
        </Select.Option>
      );
    }
    return (
      <div style={{ paddingBottom: 8 }}>
        <Row gutter={8} justify="space-between">
          <Col>
            <Radio.Group
              size="small"
              onChange={(e) => {
                setCalendarType(e.target.value);
                if (onTypeChange) {
                  onTypeChange(e.target.value);
                }
              }}
              value={calendarType}
            >
              <Radio.Button value="date">Dia</Radio.Button>
              <Radio.Button value="week">Semana</Radio.Button>
            </Radio.Group>
          </Col>
          <Col>
            <Row gutter={8}>
              <Col>
                <Select
                  size="small"
                  dropdownMatchSelectWidth={false}
                  className="my-year-select"
                  onChange={(newYear) => {
                    const now = value.clone().year(Number(newYear));
                    onChange(now);
                  }}
                  value={year}
                >
                  {options}
                </Select>
              </Col>
              <Col>
                <Select
                  size="small"
                  dropdownMatchSelectWidth={false}
                  value={String(month)}
                  onChange={(selectedMonth) => {
                    const newValue = value.clone();
                    newValue.month(parseInt(selectedMonth, 10));
                    onChange(newValue);
                  }}
                >
                  {monthOptions}
                </Select>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  };

  return (
    <div style={{ flexBasis: 280, flexShrink: 0, marginRight: 20 }}>
      <Calendar
        className="agenda-calendar"
        headerRender={headerRender}
        fullscreen={false}
        dateFullCellRender={(date) => {
          const className = getCellClassName(date, calendarType, selectedDate, selectedDates, excludeDays);
          return <div className={className}>{date.format("D")}</div>;
        }}
        defaultValue={selectedDate}
        value={selectedDate}
        disabledDate={disabledDate}
        onChange={(value) => {
          setSelectedDate(value!);
        }}
      />
    </div>
  );
};

export default AgendaDatePicker;
