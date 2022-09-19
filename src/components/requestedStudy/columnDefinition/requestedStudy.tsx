import { Descriptions, Checkbox } from "antd";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import { useState } from "react";
import PrintIcon from "../../../app/common/icons/PrintIcon";
import {
  IColumns,
  ISearch,
  getDefaultColumnProps,
} from "../../../app/common/table/utils";
import { IRequestedStudyList } from "../../../app/models/requestedStudy";
import { status } from "../../../app/util/catalogs";

type expandableProps = {
  activity: string;
  onChange: (e: CheckboxChangeEvent, id: number, solicitud: string) => void;
  printOrder: (recordId: string, requestId: string) => Promise<void>;
};

const RequestedStudyColumns = () => {
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });
  const columns: IColumns<IRequestedStudyList> = [
    {
      ...getDefaultColumnProps("solicitud", "Clave", {
        searchState,
        setSearchState,
        width: "15%",
      }),
    },
    {
      ...getDefaultColumnProps("nombre", "Nombre del Paciente", {
        searchState,
        setSearchState,
        width: "30%",
      }),
    },
    {
      ...getDefaultColumnProps("registro", "Registro", {
        searchState,
        setSearchState,
        width: "20%",
      }),
    },
    {
      ...getDefaultColumnProps("sucursal", "Sucursal", {
        searchState,
        setSearchState,
        width: "15%",
      }),
    },
    {
      ...getDefaultColumnProps("edad", "Edad", {
        searchState,
        setSearchState,
        width: "15%",
      }),
    },
    {
      ...getDefaultColumnProps("sexo", "Sexo", {
        searchState,
        setSearchState,
        width: "15%",
      }),
    },

    {
      ...getDefaultColumnProps("compañia", "Compañía", {
        searchState,
        setSearchState,
        width: "20%",
      }),
    },
  ];
  return columns;
};

export const RequestedStudyExpandable = ({
  activity,
  onChange,
  printOrder,
}: expandableProps) => {
  return {
    expandedRowRender: (item: IRequestedStudyList) => (
      <div>
        <h4>Estudios</h4>
        {item.estudios.map((x) => {
          return (
            <Descriptions
              key={x.id}
              size="small"
              bordered
              style={{ marginBottom: 5 }}
              layout="vertical"
            >
              <Descriptions.Item
                label="Estudio"
                style={{ maxWidth: 30 }}
                className="description-content"
              >
                {x.clave} - {x.nombre}
              </Descriptions.Item>
              <Descriptions.Item
                label="Estatus"
                style={{ maxWidth: 30 }}
                className="description-content"
              >
                {x.status == 2 ? "Toma de Muestra" : "Solicitado"}
              </Descriptions.Item>
              <Descriptions.Item
                label="Registro"
                style={{ maxWidth: 30 }}
                className="description-content"
              >
                {x.registro}
              </Descriptions.Item>
              <Descriptions.Item
                label="Entrega"
                style={{ maxWidth: 30 }}
                className="description-content"
              >
                {x.entrega}
              </Descriptions.Item>
              {x.status === status.requestStudy.tomaDeMuestra &&
                activity == "register" && (
                  <Descriptions.Item
                    label="Selecciona"
                    style={{ maxWidth: 30 }}
                    className="description-content"
                  >
                    <Checkbox onChange={(e) => onChange(e, x.id, item.id)}>
                      Selecciona
                    </Checkbox>
                  </Descriptions.Item>
                )}
              {x.status === status.requestStudy.solicitado &&
                activity == "cancel" && (
                  <Descriptions.Item
                    label="Selecciona"
                    style={{ maxWidth: 30 }}
                    className="description-content"
                  >
                    <Checkbox onChange={(e) => onChange(e, x.id, item.id)}>
                      Selecciona
                    </Checkbox>
                  </Descriptions.Item>
                )}
              <Descriptions.Item
                label="Imprimir Orden"
                style={{ maxWidth: 20 }}
                className="description-content"
              >
                <PrintIcon
                  key="imprimir"
                  onClick={() => {
                    printOrder(item.order, item.id);
                  }}
                />
              </Descriptions.Item>
            </Descriptions>
          );
        })}
      </div>
    ),
    rowExpandable: () => true,
    defaultExpandAllRows: true,
  };
};

export default RequestedStudyColumns;
