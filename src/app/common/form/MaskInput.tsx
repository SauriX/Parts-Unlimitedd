import { Form, FormItemProps } from "antd";
import { Rule } from "antd/lib/form";
import React from "react";
import MaskedInput, { Mask } from "react-text-mask";

interface IProps {
  formProps: FormItemProps<any>;
  required?: boolean;
  prefix?: React.ReactNode;
  placeholder?: string;
  readonly?: boolean;
  mask: Mask | ((value: string) => Mask);
}

const MaskInput = ({ formProps: itemProps, required, prefix, placeholder, readonly, mask }: IProps) => {
  let rules: Rule[] = [];

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
      <MaskedInput
        placeholder={placeholder}
        mask={mask}
        disabled={readonly}
        render={(ref, props) => (
          <input
            // autoComplete={itemProps.name?.toString()}
            className="ant-input"
            ref={(input) => input && ref(input)}
            {...props}
            disabled={readonly}
            autoComplete="off"
            // prefix={prefix}
            placeholder={placeholder ?? itemProps.label?.toString()}
          />
        )}
      />
    </Form.Item>
  );
};

export default MaskInput;
