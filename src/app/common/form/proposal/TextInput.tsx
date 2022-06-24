import { Form, FormItemProps, Input, Space, Tooltip } from "antd";
import { Rule } from "antd/lib/form";
import { RuleType } from "rc-field-form/lib/interface";
import React, { useRef } from "react";
import { InfoCircleTwoTone } from "@ant-design/icons";
import "./index.less";

interface IProps {
  formProps: FormItemProps<any>;
  max: number;
  required?: boolean;
  prefix?: React.ReactNode;
  type?: RuleType;
  placeholder?: string;
  readonly?: boolean;
  width?: string | number;
  suffix?: React.ReactNode;
  style?: React.CSSProperties;
  isGroup?: boolean;
  errors?: any[];
  onClick?: React.MouseEventHandler<HTMLInputElement> | undefined;
  onKeyUp?: React.KeyboardEventHandler<HTMLInputElement> | undefined;
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
  suffix,
  style,
  isGroup,
  errors,
  onClick,
  onKeyUp,
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
    <div>
      <Form.Item
        {...itemProps}
        name={itemProps.name}
        label={itemProps.label}
        labelAlign={itemProps.labelAlign ?? "right"}
        rules={rules}
        help=""
        className="no-error-text"
      >
        <Input
          disabled={readonly}
          autoComplete="off"
          prefix={prefix}
          type={type ?? "text"}
          placeholder={placeholder ?? itemProps.label?.toString()}
          //   suffix={suffix}
          onClick={onClick}
          onKeyUp={onKeyUp}
          style={{
            width: width ?? "100%",
            ...(style ?? {}),
          }}
        />
      </Form.Item>
      <div
        style={{
          position: "absolute",
          top: "0.1em",
          right: 5,
          padding: "0 5px",
          zIndex: 2,
          backgroundColor: "white",
        }}
      >
        <Space size="small">
          <>
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
                      <li>{x}</li>
                    ))}
                  </ul>
                }
                style={{ display: "none" }}
                //   placement="left"
              >
                <InfoCircleTwoTone twoToneColor={"red"} />
              </Tooltip>
            ) : null}
          </>
        </Space>
      </div>
    </div>
  );
};

export default TextInput;
