import { Button, Tooltip, Image } from "antd";
import React, { FC } from "react";

interface IProps {
<<<<<<< HEAD
  image: "back" | "doc" | "print"| "editar"| "agregar-archivo";
=======
  image: "back" | "doc" | "print"| "editar"| "agregar-archivo"| "edit"| "Eliminar_Clinica";
>>>>>>> d6e306b5ed46a6ffd6668b80d980c06d8b2ea54e
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
