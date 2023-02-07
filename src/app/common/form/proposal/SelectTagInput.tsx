import { Form, FormItemProps, Select, Space, Tooltip } from "antd";
import { Rule } from "antd/lib/form";
import { InfoCircleTwoTone } from "@ant-design/icons";

type IProps = {
  formProps: FormItemProps<any>;
  required?: boolean;
  placeholder?: string;
  readonly?: boolean;
  width?: string | number;
  showLabel?: boolean;
  errors?: any[];
  regex: RegExp;
};

const SelectTagInput = ({
  formProps: itemProps,
  required,
  placeholder,
  readonly,
  width,
  showLabel,
  errors,
  regex,
}: IProps) => {
  const rules: Rule[] = [];
  const name = (itemProps.label ?? placeholder ?? itemProps.name)?.toString();

  if (required) {
    rules.push({ required: true, message: `El campo ${name} es requerido` });
  }

  if (regex) {
    rules.push({
      validator(_rule, values, _callback) {
        const invalidInputs = values.filter(
          (value: any) => !value.match(regex)
        );
        if (invalidInputs.length === 0) {
          return Promise.resolve();
        } else if (invalidInputs.length === 1) {
          return Promise.reject(
            invalidInputs.join("") + ` no es un ${name?.toLowerCase()} válido`
          );
        } else {
          return Promise.reject(
            invalidInputs.slice(0, -1).join(", ") +
              " y " +
              invalidInputs.slice(-1) +
              ` no son ${name?.toLowerCase()}s válidos`
          );
        }
      },
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
        <Select
          mode="tags"
          placeholder={placeholder ?? itemProps.label?.toString()}
          options={[]}
          disabled={readonly}
          style={{ width: width ?? "100%" }}
          showSearch={false}
          open={false}
        ></Select>
      </Form.Item>
      <div
        className={`suffix-container ${readonly ? "disabled" : ""}`}
        style={{ display: showLabel || !!errors ? "" : "none" }}
      >
        <Space size="small">
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
    </div>
  );
};

export default SelectTagInput;
