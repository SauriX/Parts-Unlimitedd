import { Form, FormItemProps, Space, TimePicker, Tooltip } from "antd";
import { Rule } from "antd/lib/form";
import React, { useEffect, useRef, useState } from "react";
import { InfoCircleTwoTone } from "@ant-design/icons";
import "./index.less";

interface IProps {
  formProps: FormItemProps<any>;
  required?: boolean;
  readonly?: boolean;
  width?: string | number;
  suffix?: React.ReactNode;
  style?: React.CSSProperties;
  isGroup?: boolean;
  errors?: any[];
}

const TimeRangeInput = ({
  formProps: itemProps,
  required,
  readonly,
  width,
  suffix,
  style,
  isGroup,
  errors,
}: IProps) => {
  let ref = useRef<HTMLDivElement>(null);

  const [paddingRight, setPaddingRight] = useState(7);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const width = entries[0].target.clientWidth;
      setPaddingRight(width === 0 ? 7 : width);
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
        <TimePicker.RangePicker
          // disabledDate={disabledDate}
          disabled={readonly}
          format="HH:mm"
          style={{
            paddingRight: paddingRight,
            width: width ?? "100%",
            ...(style ?? {}),
          }}
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

export default TimeRangeInput;
