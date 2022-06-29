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
  suffix?: React.ReactNode;
  style?: React.CSSProperties;
  isGroup?: boolean;
  errors?: any[];
  onChange?: (value: any) => void;
}

const SelectInput = ({
  formProps: itemProps,
  required,
  placeholder,
  options,
  readonly,
  width,
  suffix,
  style,
  isGroup,
  errors,
  onChange,
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
          placeholder={placeholder ?? itemProps.label?.toString()}
          optionFilterProp="children"
          onChange={onChange}
          filterOption={(input: any, option: any) =>
            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          allowClear
          options={options}
          disabled={readonly}
        ></Select>
      </Form.Item>
      {/* {(!!suffix || isGroup || !!errors) && ( */}
      <div
        className={`suffix-container ${readonly ? "disabled" : ""}`}
        style={{ display: !!suffix || isGroup || !!errors ? "" : "none" }}
      >
        <Space size="small">
          {suffix ? suffix : null}
          {isGroup ? (
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
