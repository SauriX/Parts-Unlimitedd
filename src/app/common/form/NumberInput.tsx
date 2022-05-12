import { Form, FormItemProps, InputNumber } from "antd";
import { Rule } from "antd/lib/form";
import React from "react";

interface IProps {
  formProps: FormItemProps<any>;
  max: number;
  min: number;
  required?: boolean;
  prefix?: React.ReactNode;
  type?: "text" | "password" | "number";
  placeholder?: string;
  readonly?: boolean;
}

const NumberInput = ({
  formProps: itemProps,
  max,
  min,
  required,
  placeholder,
  readonly,
}: IProps) => {
  let rules: Rule[] = [];

  rules.push({
    type: "number",
    max,
    message: `El máximo es de ${max}`,
  });

  rules.push({
    type: "number",
    min,
    message: `El mínimo es de ${min}`,
  });

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
      <InputNumber
        style={{ width: "100%" }}
        // autoComplete={itemProps.name?.toString()}
        autoComplete="off"
        placeholder={placeholder ?? itemProps.label?.toString()}
        disabled={readonly}
        type={"number"}
      />
    </Form.Item>
  );
};

export default NumberInput;
