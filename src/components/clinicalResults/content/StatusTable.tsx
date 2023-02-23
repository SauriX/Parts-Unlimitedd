import { Steps } from "antd";
import { observer } from "mobx-react-lite";
import moment from "moment";
import React, { Fragment } from "react";
import { CheckCircleTwoTone  } from "@ant-design/icons";
import { IRequestStudy } from "../../../app/models/request";

type StatusTableProps = {
  currentStudy: IRequestStudy;
};

const StatusTable = ({ currentStudy }: StatusTableProps) => {
  const capturado = currentStudy.estatusId >= 4;
  const validado = currentStudy.estatusId >= 5;
  const liberado = currentStudy.estatusId >= 6;
  const enviado = currentStudy.estatusId >= 7;

  return (
    <Fragment>
      <Steps
        initial={4}
        current={currentStudy.estatusId}
        size="small"
        items={[
          {
            title: "Capturado",
            description: capturado
              ? moment(currentStudy.fechaCaptura).format("DD/MM/YYYY HH:mm")
              : "",
            subTitle: capturado ? currentStudy.usuarioCaptura : "",
            icon: <CheckCircleTwoTone twoToneColor={!capturado ? "#f0f0f0" : "#1890FF"} />
          },
          {
            title: "Validado",
            description: validado
              ? moment(currentStudy.fechaValidacion).format("DD/MM/YYYY HH:mm")
              : "",
            subTitle: validado ? currentStudy.usuarioValidacion : "",
            icon: <CheckCircleTwoTone twoToneColor={!validado ? "#f0f0f0" : "#1890FF"} />
          },
          {
            title: "Liberación",
            description: liberado
              ? moment(currentStudy.fechaLiberado).format("DD/MM/YYYY HH:mm")
              : "",
            subTitle: liberado ? currentStudy.usuarioLiberado : "",
            icon: <CheckCircleTwoTone twoToneColor={!liberado ? "#f0f0f0" : "#1890FF"} />
          },
          {
            title: "Enviado",
            description: enviado
              ? moment(currentStudy.fechaEnviado).format("DD/MM/YYYY HH:mm")
              : "",
            subTitle: enviado ? currentStudy.usuarioEnviado : "",
            icon: <CheckCircleTwoTone twoToneColor={!enviado ? "#f0f0f0" : "#1890FF"} />
          },
        ]}
      />
    </Fragment>
  );
};

export default observer(StatusTable);
