import { Form, FormItemProps, Input } from "antd";
import { Rule } from "antd/lib/form";
import React from "react";

interface IProps {
  formProps: FormItemProps<any>;
  max?: number;
  min?: number;
  required?: boolean;
  prefix?: React.ReactNode;
  type?: "text" | "password";
  placeholder?: string;
  readonly?: boolean;
}

const PasswordInput = ({
  formProps: itemProps,
  max,
  min,
  required,
  prefix,
  type,
  placeholder,
  readonly,
}: IProps) => {
  let rules: Rule[] = [];

  if (max) {
    rules.push({ max, message: `La longitud máxima es de ${max}` });
  }

  if (min) {
    rules.push({ min, message: `La longitud mínima es de ${min}` });
  } 

  if (required) {
    rules.push({
      required: true,
      message: "El campo es requerido",
      whitespace: true,
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
      <Input.Password
        autoComplete="off"
        prefix={prefix}
        type={type ?? "text"}
        placeholder={placeholder ?? itemProps.label?.toString()}
        disabled={readonly}
      />
    </Form.Item>
  );
};

export default PasswordInput;
