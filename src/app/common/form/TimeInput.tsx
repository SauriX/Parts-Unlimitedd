import { Form, FormItemProps, TimePicker } from "antd";
import { Rule } from "antd/lib/form";
import React from "react";

interface IProps {
  formProps: FormItemProps<any>;
  required?: boolean;
  readonly?: boolean;
}

const TimeInput = ({ formProps: itemProps, required, readonly }: IProps) => {
  let rules: Rule[] = [];

  if (required) {
    rules.push({
      required: true,
      message: "El campo es requerido",
    });
  }

  return (
    <Form.Item
      {...itemProps}
      name={itemProps.name}
      label={itemProps.label}
      labelAlign={itemProps.labelAlign ?? "right"}
      rules={rules}
    >
      <TimePicker
        style={{ width: "100%" }}
        disabled={readonly}
        format={"HH:mm"}
        showSecond={false}
      />
    </Form.Item>
  );
};

export default TimeInput;
