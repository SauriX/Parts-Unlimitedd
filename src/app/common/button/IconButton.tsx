import { Button, Tooltip } from "antd";
import React, { FC } from "react";

interface IProps {
  icon: React.ReactNode;
  title?: string;
  danger?: boolean;
  onClick?: React.MouseEventHandler<HTMLElement>;
  disabled?: boolean;
}

const IconButton: FC<IProps> = ({ title, icon, danger, onClick, disabled }) => {
  return (
    <Tooltip title={title}>
      <Button
        danger={danger}
        shape="circle"
        icon={icon}
        size="small"
        onClick={onClick}
        disabled={disabled}
      />
    </Tooltip>
  );
};

export default IconButton;
