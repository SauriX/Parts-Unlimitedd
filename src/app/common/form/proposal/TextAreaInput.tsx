import { Form, FormItemProps, Space, Tooltip } from "antd";
import { Rule } from "antd/lib/form";
import TextArea from "antd/lib/input/TextArea";
import React from "react";
import { InfoCircleTwoTone } from "@ant-design/icons";

interface IProps {
  formProps: FormItemProps<any>;
  max?: number;
  required?: boolean;
  rows: number;
  placeholder?: string;
  readonly?: boolean;
  autoSize?: boolean;
  bordered?: boolean;
  width?: string | number;
  suffix?: React.ReactNode;
  style?: React.CSSProperties;
  isGroup?: boolean;
  errors?: any[];
}

const TextAreaInput = ({
  formProps: itemProps,
  max,
  rows,
  required,
  placeholder,
  readonly,
  autoSize,
  bordered,
  width,
  suffix,
  style,
  isGroup,
  errors,
}: IProps) => {
  let rules: Rule[] = [];

  if (max) {
    rules.push({ max, message: `La longitud máxima es de ${max}` });
  }

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
        <TextArea
          disabled={readonly}
          rows={rows}
          autoComplete="off"
          placeholder={placeholder ?? itemProps.label?.toString()}
          autoSize={autoSize}
          bordered={bordered}
        />
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

export default TextAreaInput;
