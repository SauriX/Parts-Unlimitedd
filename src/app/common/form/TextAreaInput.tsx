import { Form, FormItemProps } from "antd";
import { Rule } from "antd/lib/form";
import TextArea from "antd/lib/input/TextArea";
import React from "react";

interface IProps {
  formProps: FormItemProps<any>;
  max?: number;
  required?: boolean;
  rows: number;
  placeholder?: string;
  readonly?: boolean;
  autoSize?: boolean;
}

const TextAreaInput = ({
  formProps: itemProps,
  max,
  rows,
  required,
  placeholder,
  readonly,
  autoSize,
}: IProps) => {
  let rules: Rule[] = [];

  if (max) {
    rules.push({ max, message: `La longitud máxima es de ${max}` });
  }

  if (required) {
    rules.push({ required: true, message: "El campo es requerido" });
  }

  return (
    <Form.Item
      {...itemProps}
      name={itemProps.name}
      label={itemProps.label}
      labelAlign={itemProps.labelAlign ?? "right"}
      rules={rules}
    >
      <TextArea
        disabled={readonly}
        rows={rows}
        autoComplete="off"
        placeholder={placeholder ?? itemProps.label?.toString()}
        autoSize={autoSize}
      />
    </Form.Item>
  );
};

export default TextAreaInput;
