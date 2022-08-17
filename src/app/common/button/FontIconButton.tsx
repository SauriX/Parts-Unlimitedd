import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Tooltip } from "antd";
import React, { FC } from "react";

interface IProps {
  icon: IconDefinition;
  title?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

const FontIconButton: FC<IProps> = ({ title, icon, onClick }) => {
  return (
    <Tooltip title={title}>
      <Button
        shape="circle"
        icon={<FontAwesomeIcon style={{ fontSize: 12, marginBottom: 2 }} icon={icon} />}
        size="small"
        onClick={onClick}
      />
    </Tooltip>
  );
};

export default FontIconButton;
