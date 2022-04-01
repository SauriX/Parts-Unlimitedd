import { Button, Tooltip, Image } from "antd";
import React, { FC } from "react";

interface IProps {
  image: "back" | "doc" | "print"| "editar"| "agregar-archivo";
  title?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

const ImageButton: FC<IProps> = ({ title, image, onClick }) => {
  return (
    <Tooltip title={title}>
      <Image
        style={{ height: 20, cursor: "pointer" }}
        src={`/${process.env.REACT_APP_NAME}/admin/assets/${image}.png`}
        preview={false}
        onClick={onClick}
      />
    </Tooltip>
  );
};

export default ImageButton;
