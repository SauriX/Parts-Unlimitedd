import { Form, FormItemProps, Select } from "antd";
import { Rule } from "antd/lib/form";
import React from "react";
import { IOptions } from "../../models/shared";

interface IProps {
  formProps: FormItemProps<any>;
  required?: boolean;
  placeholder?: string;
  onChange?: (value: any) => void;
  options: IOptions[];
  readonly?: boolean;
  defaultValue?:any;
  value?:any;
}

const SelectInput = ({
  formProps: itemProps,
  required,
  placeholder,
  onChange,
  options,
  readonly,
  defaultValue,value
}: IProps) => {
  let rules: Rule[] = [];

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
      <Select
        showSearch
        placeholder={placeholder ?? itemProps.label?.toString()}
        optionFilterProp="children"
        onChange={onChange}
        filterOption={(input: any, option: any) =>
          option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        allowClear
        options={options}
        disabled={readonly}
        defaultValue={defaultValue}
        value={value}
      ></Select>
    </Form.Item>
  );
};

export default SelectInput;
