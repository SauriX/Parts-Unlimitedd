import {
  DatePicker,
  DatePickerProps,
  Form,
  FormItemProps,
  Space,
  Tooltip,
} from "antd";
import { Rule } from "antd/lib/form";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { InfoCircleTwoTone } from "@ant-design/icons";
import "./index.less";

interface IProps {
  formProps: FormItemProps<any>;
  required?: boolean;
  readonly?: boolean;
  width?: string | number;
  suffix?: React.ReactNode;
  style?: React.CSSProperties;
  isGroup?: boolean;
  errors?: any[];
  disabledDates?: (current: moment.Moment) => boolean;
  disableBeforeDates?: boolean;
  disableAfterDates?: boolean;
  pickerType?:
    | "time"
    | "date"
    | "week"
    | "month"
    | "quarter"
    | "year"
    | undefined;
}

const dateFormat = "DD/MM/YYYY";
const weekFormat = "DD/MM";
const monthFormat = "MM/YYYY";
const yearFormat = "YYYY";

const customWeekStartEndFormat: DatePickerProps["format"] = (value) =>
  `${moment(value).startOf("week").format(weekFormat)} - ${moment(value)
    .endOf("week")
    .format(weekFormat)}`;

const DateInput = ({
  formProps: itemProps,
  required,
  readonly,
  width,
  suffix,
  style,
  isGroup,
  errors,
  disabledDates,
  disableBeforeDates,
  disableAfterDates,
  pickerType,
}: IProps) => {
  let ref = useRef<HTMLDivElement>(null);

  const [paddingRight, setPaddingRight] = useState(7);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const width = entries[0].target.clientWidth;
      setPaddingRight(width === 0 ? 7 : width);
    });

    if (ref.current) {
      observer.observe(ref.current);
    }
    const _ref = ref.current;

    return () => {
      if (_ref) observer.unobserve(_ref);
    };
  }, []);

  let rules: Rule[] = [];

  if (required) {
    rules.push({
      required: true,
      message: "El campo es requerido",
    });
  }

  function disabledBeforeDate(current: moment.Moment) {
    return disableBeforeDates ? current.isBefore(moment(), "day") : false;
  }
  function disabledAfterDate(current: moment.Moment) {
    return disableAfterDates ? current.isAfter(moment(), "day") : false;
  }

  return (
    <div className="custom-input">
      <Form.Item
        {...itemProps}
        name={itemProps.name}
        label={itemProps.label}
        labelAlign={itemProps.labelAlign ?? "right"}
        rules={rules}
        help=""
        className="no-error-text"
      >
        <DatePicker
          // disabledDate={disabledDates}
          disabledDate={
            disableAfterDates
              ? disabledAfterDate
              : disableBeforeDates
              ? disabledBeforeDate
              : disabledDates
          }
          disabled={readonly}
          format={
            pickerType === "week"
              ? customWeekStartEndFormat
              : pickerType === "month"
              ? monthFormat
              : pickerType === "year"
              ? yearFormat
              : dateFormat
          }
          style={{
            paddingRight: paddingRight,
            width: width ?? "100%",
            ...(style ?? {}),
          }}
          picker={pickerType ?? "date"}
        />
      </Form.Item>
      <div
        className={`suffix-container ${readonly ? "disabled" : ""}`}
        style={{ display: !!suffix || isGroup || !!errors ? "" : "none" }}
        ref={ref}
      >
        <Space size="small">
          {suffix ? suffix : null}
          {isGroup ? (
            <Tooltip key="info" title={itemProps.label}>
              <InfoCircleTwoTone />
            </Tooltip>
          ) : null}
          {errors && errors.length > 0 ? (
            <Tooltip
              key="error"
              color="red"
              title={
                <ul style={{ listStyleType: "none", margin: 0, padding: 0 }}>
                  {errors.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              }
              style={{ display: "none" }}
            >
              <InfoCircleTwoTone twoToneColor={"red"} />
            </Tooltip>
          ) : null}
        </Space>
      </div>
      {/* )} */}
    </div>
  );
};

export default DateInput;
