import { Form, FormItemProps, Input } from "antd";
import { Rule } from "antd/lib/form";
import { RuleType } from "rc-field-form/lib/interface";
import React from "react";

interface IProps {
  formProps: FormItemProps<any>;
  max?: number;
  required?: boolean;
  prefix?: React.ReactNode;
  type?: RuleType;
  placeholder?: string;
  readonly?: boolean;
  width?: string | number;
  onClick?: React.MouseEventHandler<HTMLInputElement> | undefined;
  onKeyUp?: React.KeyboardEventHandler<HTMLInputElement> | undefined;
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
}

const TextInput = ({
  formProps: itemProps,
  max,
  required,
  prefix,
  type,
  placeholder,
  readonly,
  width,
  onClick,
  onKeyUp,
  onChange,
}: IProps) => {
  let rules: Rule[] = [];

  if (max) {
    rules.push({
      validator: (_, value: string) => {
        if (!value || value.length <= max) {
          return Promise.resolve();
        }
        return Promise.reject(`La longitud máxima es de ${max}`);
      },
    });
  }

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
        onClick={onClick}
        onKeyUp={onKeyUp}
        onChange={onChange}
        style={{ width: width ?? "100%" }}
      />
    </Form.Item>
  );
};

export default TextInput;
