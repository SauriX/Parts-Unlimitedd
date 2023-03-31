import { Form, FormItemProps, Space, Tooltip } from "antd";
import { Rule, RuleObject } from "antd/lib/form";
import React, { useEffect, useRef, useState } from "react";
import MaskedInput, { Mask } from "react-text-mask";
import { InfoCircleTwoTone } from "@ant-design/icons";
import "./index.less";

interface IProps {
  formProps: FormItemProps<any>;
  required?: boolean;
  prefix?: React.ReactNode;
  placeholder?: string;
  readonly?: boolean;
  mask: (string | RegExp)[];
  width?: string | number;
  suffix?: React.ReactNode;
  style?: React.CSSProperties;
  isGroup?: boolean;
  errors?: any[];
  min?: number;
  max?: number;
  validator?: (_: RuleObject, value: any) => Promise<any>;
}

const MaskInput = ({
  formProps: itemProps,
  required,
  prefix,
  placeholder,
  readonly,
  mask,
  width,
  suffix,
  style,
  isGroup,
  errors,
  validator,
  min,
  max,
}: IProps) => {
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

  let rules: any[] = [];

  if (required) {
    rules.push({
      required: true,
      message: "El campo es requerido",
      whitespace: true,
    });
  }
  if (max) {
    rules.push({
      type: "number",
      max,
      message: `El máximo es de ${max}`,
    });
  }
  if (min) {
    rules.push({
      type: "number",
      min,
      message: `El mínimo es de ${min}`,
    });
  }

  if (validator) {
    rules.push({ validator });
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
        <MaskedInput
          placeholder={placeholder}
          mask={mask}
          disabled={readonly}
          render={(ref: any, props: any) => (
            <input
              // autoComplete={itemProps.name?.toString()}
              className="ant-input ant-input-sm"
              ref={(input) => input && ref(input)}
              {...props}
              disabled={readonly}
              autoComplete="off"
              minLength={min}
              maxLength={max}
              // prefix={prefix}
              placeholder={placeholder ?? itemProps.label?.toString()}
              style={{
                paddingRight: paddingRight,
                width: width ?? "100%",
                ...(style ?? {}),
              }}
            />
          )}
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

export default MaskInput;
