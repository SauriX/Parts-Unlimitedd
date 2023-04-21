import {
  Button,
  Col,
  Divider,
  Form,
  FormItemProps,
  Row,
  Select,
  Space,
  Tooltip,
} from "antd";
import { FormInstance, Rule } from "antd/lib/form";
import React, { useRef } from "react";
import { IOptions } from "../../../models/shared";
import { InfoCircleTwoTone } from "@ant-design/icons";

type IProps =
  | {
      form: FormInstance<any>;
      formProps: FormItemProps<any>;
      required?: boolean;
      placeholder?: string;
      options: IOptions[];
      readonly?: boolean;
      width?: string | number;
      multiple: boolean;
      suffix?: React.ReactNode;
      style?: React.CSSProperties;
      showLabel?: boolean;
      errors?: any[];
      onChange?: (value: any, option: IOptions | IOptions[]) => void;
      defaultValue?: any;
      value?: any;
      showArrow?: boolean;
      loading?: boolean;
    }
  | {
      form?: FormInstance<any>;
      formProps: FormItemProps<any>;
      required?: boolean;
      placeholder?: string;
      options: IOptions[];
      readonly?: boolean;
      width?: string | number;
      multiple?: false;
      suffix?: React.ReactNode;
      style?: React.CSSProperties;
      showLabel?: boolean;
      errors?: any[];
      onChange?: (value: any, option: IOptions | IOptions[]) => void;
      defaultValue?: any;
      value?: any;
      showArrow?: boolean;
      loading?: boolean;
    };

const SelectInput = ({
  form,
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
  value,
  showArrow,
  loading
}: IProps) => {
  let ref = useRef<HTMLDivElement>(null);

  let rules: Rule[] = [];

  if (required) {
    rules.push({ required: true, message: "El campo es requerido" });
  }

  if (multiple && !form) {
    console.error.apply("La instancia de form es requerida en select multiple");
    throw new Error("La instancia de form es requerida en select multiple");
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
          showArrow={showArrow ?? true}
          options={options}
          disabled={readonly}
          maxTagCount={"responsive"}
          style={{ width: width ?? "100%", ...(style ?? {}) }}
          defaultValue={defaultValue}
          loading={loading}
          value={value}
          dropdownRender={
            !multiple || !form
              ? undefined
              : (menu) => (
                  <>
                    <Row
                      ref={ref}
                      style={{ padding: "5px 12px" }}
                      gutter={[12, 12]}
                    >
                      <Col span={12}>
                        <Button
                          style={{ width: "100%" }}
                          onClick={() => {
                            form.setFieldValue(
                              itemProps.name!,
                              options.map((x) => x.value)
                            );
                          }}
                        >
                          {ref.current && ref.current.clientWidth > 300
                            ? "Seleccionar todos"
                            : "+"}
                        </Button>
                      </Col>
                      <Col span={12}>
                        <Button
                          style={{ width: "100%" }}
                          onClick={() => {
                            form.setFieldValue(itemProps.name!, []);
                          }}
                        >
                          {ref.current && ref.current.clientWidth > 300
                            ? "Quitar todos"
                            : "-"}
                        </Button>
                      </Col>
                    </Row>
                    <Divider style={{ margin: "8px 0" }} />
                    {menu}
                  </>
                )
          }
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
