import { Form, FormItemProps, InputNumber, Space, Tooltip } from "antd";
import { Rule } from "antd/lib/form";
import React, { useEffect, useRef, useState } from "react";
import { InfoCircleTwoTone } from "@ant-design/icons";

interface IProps {
  formProps: FormItemProps<any>;
  max?: number;
  min?: number;
  required?: boolean;
  prefix?: React.ReactNode;
  type?: "text" | "password" | "number";
  placeholder?: string;
  readonly?: boolean;
  width?: string | number;
  suffix?: React.ReactNode;
  style?: React.CSSProperties;
  showLabel?: boolean;
  errors?: any[];
  formatter?:
    | ((
        value: number | undefined,
        info: {
          userTyping: boolean;
          input: string;
        }
      ) => string)
    | undefined;
  parser?: ((displayValue: string | undefined) => number) | undefined;
  controls?: boolean;
}

const NumberInput = ({
  formProps: itemProps,
  max,
  min,
  required,
  placeholder,
  readonly,
  width,
  suffix,
  style,
  showLabel: isGroup,
  errors,
  formatter,
  parser,
  controls
}: IProps) => {
  let ref = useRef<HTMLDivElement>(null);

  const [paddingRight, setPaddingRight] = useState(7);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      console.log(entries[0]);
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
      type: "number",
      max,
      message: `El máximo es de ${max}`,
    });
  }

  if (min != null) {
    rules.push({
      type: "number",
      min,
      message: `El mínimo es de ${min}`,
    });
  }

  if (required) {
    rules.push({
      required: true,
      message: "El campo es requerido",
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
        <InputNumber<number>
          autoComplete="off"
          placeholder={placeholder ?? itemProps.label?.toString()}
          disabled={readonly}
          style={{
            paddingRight: paddingRight,
            width: width ?? "100%",
            ...(style ?? {}),
          }}
          formatter={formatter}
          parser={parser}
          controls={controls}
        />
      </Form.Item>
      {/* {(!!suffix || isGroup || !!errors) && ( */}
      <div
        className={`suffix-number-container ${readonly ? "disabled" : ""}`}
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

export default NumberInput;
