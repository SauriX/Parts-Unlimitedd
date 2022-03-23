import { Button, Result } from "antd";
import { ResultStatusType } from "antd/lib/result";
import React from "react";
import history from "../util/history";

const ErrorComponent = ({
  status,
  message,
  hideButton,
}: {
  status?: ResultStatusType;
  message: string;
  hideButton?: boolean;
}) => {
  return (
    <Result
      status={status}
      title={status}
      style={{ height: "70%", paddingTop: 20 }}
      subTitle={message}
      extra={
        hideButton ? null : (
          <Button type="primary" onClick={() => history.push("/")}>
            Home
          </Button>
        )
      }
    />
  );
};

export default ErrorComponent;
