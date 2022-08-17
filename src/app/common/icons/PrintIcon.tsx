import { faCloudArrowDown, faPrint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip } from "antd";
import React from "react";

type Props = {
  showTitle?: boolean;
  onClick?: React.MouseEventHandler<SVGSVGElement>;
};

const PrintIcon = ({ showTitle = true, onClick }: Props) => {
  return (
    <Tooltip title={showTitle ? "Imprimir" : undefined}>
      <FontAwesomeIcon style={{ cursor: "pointer" }} size="lg" icon={faPrint} onClick={onClick} />
    </Tooltip>
  );
};

export default PrintIcon;
