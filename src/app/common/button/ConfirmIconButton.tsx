import { Button, Popconfirm, Tooltip } from "antd";
import React, { FC } from "react";

interface IProps {
  confirmTitle: string;
  icon: React.ReactNode;
  title?: string;
  onConfirm?:
    | ((e?: React.MouseEvent<HTMLElement, MouseEvent> | undefined) => void)
    | undefined;
}

const ConfirmIconButton: FC<IProps> = ({
  confirmTitle,
  icon,
  title,
  onConfirm,
}) => {
  return (
    <Popconfirm
      title={confirmTitle}
      onConfirm={onConfirm}
      okText="Sí"
      cancelText="No"
    >
      <Tooltip title={title}>
        <Button shape="circle" icon={icon} size="small" />
      </Tooltip>
    </Popconfirm>
  );
};

export default ConfirmIconButton;
