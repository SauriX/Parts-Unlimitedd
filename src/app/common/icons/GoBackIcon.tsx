import { faCloudArrowDown, faPrint, faShare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip } from "antd";
import React from "react";

type Props = {
  showTitle?: boolean;
  onClick?: React.MouseEventHandler<SVGSVGElement>;
};

const GoBackIcon = ({ showTitle = true, onClick }: Props) => {
  return (
    <Tooltip title={showTitle ? "Regresar" : undefined}>
      <FontAwesomeIcon
        style={{ cursor: "pointer" }}
        size="lg"
        flip="horizontal"
        icon={faShare}
        onClick={onClick}
      />
    </Tooltip>
  );
};

export default GoBackIcon;
