import { Button, Tooltip } from "antd";
import React, { FC } from "react";

interface IProps {
  icon: React.ReactNode;
  title?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

const IconButton: FC<IProps> = ({ title, icon, onClick }) => {
  return (
    <Tooltip title={title}>
      <Button shape="circle" icon={icon} size="small" onClick={onClick} />
    </Tooltip>
  );
};

export default IconButton;
