import { Form, FormItemProps, Input } from "antd";
import { Rule } from "antd/lib/form";
import { RuleType } from "rc-field-form/lib/interface";
import React from "react";

interface IProps {
  formProps: FormItemProps<any>;
  max: number;
  required?: boolean;
  prefix?: React.ReactNode;
  type?: RuleType;
  placeholder?: string;
  readonly?: boolean;
}

const TextInput = ({ formProps: itemProps, max, required, prefix, type, placeholder, readonly }: IProps) => {
  let rules: Rule[] = [];

  // if (max) {
  //   rules.push({
  //     max,
  //     message: `La longitud máxima es de ${max}`,
  //   });
  // }

  if (required) {
    rules.push({
      required: true,
      message: "El campo es requerido",
      whitespace: true,
    });
  }

  if (type) {
    rules.push({
      type: type,
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
      <Input
        // autoComplete={itemProps.name?.toString()}
        disabled={readonly}
        autoComplete="off"
        prefix={prefix}
        type={type ?? "text"}
        placeholder={placeholder ?? itemProps.label?.toString()}
      />
    </Form.Item>
  );
};

export default TextInput;
