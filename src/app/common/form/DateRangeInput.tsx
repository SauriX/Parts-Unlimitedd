import { DatePicker, Form, FormItemProps } from "antd";
import { Rule } from "antd/lib/form";
import moment from "moment";
import React from "react";

interface IProps {
  formProps: FormItemProps<any>;
  required?: boolean;
  readonly?: boolean;
}

const DateRangeInput = ({ formProps: itemProps, required, readonly }: IProps) => {
  let rules: Rule[] = [];

  if (required) {
    rules.push({
      required: true,
      message: "El campo es requerido",
    });
  }

  function disabledDate(current: moment.Moment) {
    return current.isBefore(moment(), "day");
  }

  return (
    <Form.Item
      {...itemProps}
      name={itemProps.name}
      label={itemProps.label}
      labelAlign={itemProps.labelAlign ?? "right"}
      rules={rules}
    >
      <DatePicker.RangePicker disabledDate={disabledDate} 
      disabled={readonly} format="DD/MM/YYYY" />
    </Form.Item>
  );
};

export default DateRangeInput;
