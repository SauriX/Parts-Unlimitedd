import { faCloudArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip } from "antd";
import React from "react";

type Props = {
  showTitle?: boolean;
  onClick?: React.MouseEventHandler<SVGSVGElement>;
};

const DownloadIcon = ({ showTitle = true, onClick }: Props) => {
  return (
    <Tooltip title={showTitle ? "Descargar" : undefined}>
      <FontAwesomeIcon style={{ cursor: "pointer" }} size="lg" icon={faCloudArrowDown} onClick={onClick} />
    </Tooltip>
  );
};

export default DownloadIcon;
