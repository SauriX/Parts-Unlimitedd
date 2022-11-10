import React, { FC, ReactNode } from "react";
import { Typography, Image } from "antd";

const { Title } = Typography;

type Props = {
  title: string;
  icon?: ReactNode;
  image?: imagesType | imagesLogo;
  folder?: imagesFolder;
};

const HeaderTitle: FC<Props> = ({
  title,
  icon,
  image,
  folder = "headerImages",
}) => {
  return (
    <Title level={4} className="header-title">
      {image ? (
        <Image
          src={`/${process.env.REACT_APP_NAME}/admin/assets/${folder}/${image}.png`}
          preview={false}
        />
      ) : null}
      {icon ? icon : null}
      {title}
    </Title>
  );
};

export default HeaderTitle;

export type imagesFolder = "headerImages" | "logos";

export type imagesLogo = "weeclinic";

export type imagesType =
  | "alerta"
  | "camion"
  | "cancelar"
  | "cargo"
  | "catalogo"
  | "cita"
  | "compañia"
  | "contacto"
  | "descuento"
  | "doctor"
  | "domicilio"
  | "empresa"
  | "equipo"
  | "estudio"
  | "expediente"
  | "grafico"
  | "indicacion"
  | "laboratorio"
  | "lealtad"
  | "maquilador"
  | "paquete"
  | "parametro"
  | "precio"
  | "promocion"
  | "reactivo"
  | "registradora"
  | "reporte"
  | "rol"
  | "ruta"
  | "sucursal"
  | "tomaMuestra"
  | "ordenseguimiento"
  | "sitio-web"
  | "portapapeles"
  | "usuario"
  | "segruta"
  | "worklist"
  | "validacion"
  | "massSearch";
