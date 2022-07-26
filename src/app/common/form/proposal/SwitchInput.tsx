import { Form, FormItemProps, Switch } from "antd";
import { SwitchChangeEventHandler } from "antd/lib/switch";
import React from "react";

interface IProps extends FormItemProps<any> {
  readonly?: boolean;
  checkedChildren?: React.ReactNode;
  unCheckedChildren?: React.ReactNode;
  onChange?: SwitchChangeEventHandler;
}

const SwitchInput = (props: IProps) => {
  const { readonly, checkedChildren, unCheckedChildren, onChange, ...prop } = props;
  return (
    <Form.Item
      labelAlign={props.labelAlign ?? "right"}
      valuePropName="checked"
      {...prop}
      help=""
      className="no-error-text"
    >
      <Switch
        disabled={readonly}
        checkedChildren={checkedChildren}
        unCheckedChildren={unCheckedChildren}
        onChange={onChange}
      />
    </Form.Item>
  );
};

export default SwitchInput;
