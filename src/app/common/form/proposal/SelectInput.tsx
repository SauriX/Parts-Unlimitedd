import { Form, FormItemProps, Select, Space, Tooltip } from "antd";
import { Rule } from "antd/lib/form";
import React, { useEffect, useRef, useState } from "react";
import { IOptions } from "../../../models/shared";
import { InfoCircleTwoTone } from "@ant-design/icons";

interface IProps {
  formProps: FormItemProps<any>;
  required?: boolean;
  placeholder?: string;
  options: IOptions[];
  readonly?: boolean;
  width?: string | number;
  multiple?: boolean;
  suffix?: React.ReactNode;
  style?: React.CSSProperties;
  showLabel?: boolean;
  errors?: any[];
  onChange?: (value: any, option: IOptions | IOptions[]) => void;
  defaultValue?:any;
  value?:any;
}

const SelectInput = ({
  formProps: itemProps,
  required,
  placeholder,
  options,
  readonly,
  width,
  multiple,
  suffix,
  style,
  showLabel,
  errors,
  onChange,
  defaultValue, 
  value
}: IProps) => {
  let rules: Rule[] = [];

  if (required) {
    rules.push({ required: true, message: "El campo es requerido" });
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
        <Select
          showSearch
          mode={!multiple ? undefined : "multiple"}
          placeholder={placeholder ?? itemProps.label?.toString()}
          optionFilterProp="children"
          onChange={onChange}
          filterOption={(input: any, option: any) =>
            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          allowClear
          options={options}
          disabled={readonly}
          maxTagCount={"responsive"}
          style={{ width: width ?? "100%" }}
          defaultValue={defaultValue}
        value={value}
        ></Select>
      </Form.Item>
      {/* {(!!suffix || isGroup || !!errors) && ( */}
      <div
        className={`suffix-container ${readonly ? "disabled" : ""}`}
        style={{ display: !!suffix || showLabel || !!errors ? "" : "none" }}
      >
        <Space size="small">
          {suffix ? suffix : null}
          {showLabel ? (
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

export default SelectInput;
