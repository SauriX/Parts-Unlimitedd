import { Checkbox, Form, FormItemProps } from "antd";
import React from "react";

interface IProps extends FormItemProps<any> {
  readonly?: boolean;
  checkedChildren?: React.ReactNode;
  unCheckedChildren?: React.ReactNode;
}

const CheckInput = (props: IProps) => {
  const { readonly, checkedChildren, unCheckedChildren, ...prop } = props;
  return (
    <Form.Item
      labelAlign={props.labelAlign ?? "right"}
      valuePropName="checked"
      {...prop}
    >
      <Checkbox disabled={readonly} />
    </Form.Item>
  );
};

export default CheckInput;
