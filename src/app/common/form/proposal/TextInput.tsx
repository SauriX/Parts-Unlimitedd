import { Form, FormItemProps, Input, Space, Tooltip } from "antd";
import { Rule } from "antd/lib/form";
import { RuleType } from "rc-field-form/lib/interface";
import React, { useEffect, useRef, useState } from "react";
import { InfoCircleTwoTone } from "@ant-design/icons";
import "./index.less";

interface IProps {
  formProps: FormItemProps<any>;
  max?: number;
  min?: number;
  required?: boolean;
  prefix?: React.ReactNode;
  type?: RuleType;
  placeholder?: string;
  readonly?: boolean;
  width?: string | number;
  suffix?: React.ReactNode;
  style?: React.CSSProperties;
  showLabel?: boolean;
  errors?: any[];
  onClick?: React.MouseEventHandler<HTMLInputElement> | undefined;
  onKeyUp?: React.KeyboardEventHandler<HTMLInputElement> | undefined;
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
  onPressEnter?: React.KeyboardEventHandler<HTMLInputElement> | undefined;
  autoFocus?: boolean | undefined;
}

const TextInput = ({
  formProps: itemProps,
  max,
  min,
  required,
  prefix,
  type,
  placeholder,
  readonly,
  width,
  suffix,
  style,
  showLabel: isGroup,
  errors,
  onClick,
  onKeyUp,
  onChange,
  onPressEnter,
autoFocus
}: // onChange,
IProps) => {
  let ref = useRef<HTMLDivElement>(null);

  const [paddingRight, setPaddingRight] = useState(7);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      setPaddingRight(entries[0].target.clientWidth);
    });

    if (ref.current) {
      observer.observe(ref.current);
    }
    const _ref = ref.current;

    return () => {
      if (_ref) observer.unobserve(_ref);
    };
  }, []);

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
  if (min) {
    rules.push({
      validator: (_, value: string) => {
        if (!value || value.length >= min) {
          return Promise.resolve();
        }
        return Promise.reject(`La longitud mínima es de ${min}`);
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
        <Input
          disabled={readonly}
          autoComplete="off"
          prefix={prefix}
          type={type ?? "text"}
          placeholder={placeholder ?? itemProps.label?.toString()}
          onClick={onClick}
          onKeyUp={onKeyUp}
          onChange={onChange}
          onPressEnter={onPressEnter}
          maxLength={max ?? undefined}
          minLength={min ?? undefined}
          style={{
            paddingRight: paddingRight,
            width: width ?? "100%",
            ...(style ?? {}),
          }}
          allowClear
          autoFocus={autoFocus}
        />
      </Form.Item>
      {/* {(!!suffix || isGroup || !!errors) && ( */}
      <div
        className={`suffix-container ${readonly ? "disabled" : ""}`}
        style={{ display: !!suffix || isGroup || !!errors ? "" : "none" }}
        ref={ref}
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

export default TextInput;
