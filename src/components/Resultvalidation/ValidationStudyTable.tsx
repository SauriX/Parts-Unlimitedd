import { Checkbox, Table, Typography } from "antd";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import { useState } from "react";
import PrintIcon from "../../app/common/icons/PrintIcon";
import { EyeOutlined } from "@ant-design/icons";
import {
    IColumns,
    ISearch,
    getDefaultColumnProps,
} from "../../app/common/table/utils";
import { IUpdate } from "../../app/models/requestedStudy";
import {
    Ivalidationlist,
    IvalidationStudyList,
} from "../../app/models/resultValidation";

import { useNavigate } from "react-router";
import { checked } from "../../app/models/relaseresult";
const { Link, Text } = Typography;

type expandableProps = {
    activiti: string;
    onChange: (e: CheckboxChangeEvent, id: number, solicitud: string) => void;
    viewTicket: (recordId: any) => Promise<void>;
    visto: checked[];
    setvisto: React.Dispatch<React.SetStateAction<checked[]>>;
    updateData: IUpdate[];
    //cambiar: boolean
};

type tableProps = {
    printTicket: (recordId: string, requestId: string) => Promise<void>;
};

const ValidationStudyColumns = ({ printTicket }: tableProps) => {
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });
  const navigate = useNavigate();
  const columns: IColumns<Ivalidationlist> = [
    {
      ...getDefaultColumnProps("solicitud", "Clave", {
        searchState,
        setSearchState,
        width: "15%",
      }),
      render: (_value, record) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Link
            onClick={() => {
              navigate(
                `/clinicResultsDetails/${record?.order}/${record?.id}?return=validation`
              );
/*               navigate(
                `/requests/${record.order}/${record.id}`
              ); */
                        }}
                    >
                        {record.solicitud}
                    </Link>
                </div>
            ),
        },
        {
            ...getDefaultColumnProps("nombre", "Nombre del Paciente", {
                searchState,
                setSearchState,
                width: "25%",
            }),
        },
        {
            ...getDefaultColumnProps("registro", "Registro", {
                searchState,
                setSearchState,
                width: "10%",
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
                width: "5%",
            }),
        },
        {
            ...getDefaultColumnProps("sexo", "Sexo", {
                searchState,
                setSearchState,
                width: "5%",
            }),
        },

        {
            ...getDefaultColumnProps("compañia", "Compañía", {
                searchState,
                setSearchState,
                width: "15%",
            }),
        },
        {
            key: "imprimir",
            dataIndex: "imprimir",
            title: "Imprimir orden",
            align: "center",
            width: "10%",
            render: (_value, record) => (
                <>
                    <PrintIcon
                        key="imprimir"
                        onClick={() => {
                            printTicket(record.order, record.id);
                        }}
                    />
                </>
            ),
        },
    ];
    return columns;
};

export const ValidationStudyExpandable = ({
    activiti,
    onChange,
    viewTicket,
    visto,
    setvisto,
    updateData,
}: // cambiar
expandableProps) => {
    const [ver, setver] = useState<boolean>(false);
    const [cambio, stcambio] = useState<boolean>(false);
    const nestedColumns: IColumns<IvalidationStudyList> = [
        {
            ...getDefaultColumnProps("clave", "Estudio", {
                width: "30%",
            }),
            render: (_value, record) => record.study,
        },
        {
            ...getDefaultColumnProps("nombreEstatus", "Estatus", {
                width: "20%",
            }),
            render: (_value, record) => record.status,
        },
        {
            ...getDefaultColumnProps("registro", "Registro", {
                width: "20%",
            }),
            render: (_value, record) => record.registro,
        },
        {
            ...getDefaultColumnProps("entrega", "Entrega", {
                width: "20%",
            }),
            render: (_value, record) => record.entrega,
        },
        {
            key: "Seleccionar",
            dataIndex: "seleccionar",
            title: "Seleccionar",
            align: "center",
            width: "10%",
            render: (_value, record) => (
                <>
                    {((record.estatus === 4 && (activiti == "register") &&
                        visto.find(
                            (x) =>
                                x.idSolicitud == record.solicitudId &&
                                x.idstudio == record.id
                        ) != undefined) ||
                        (ver &&
                            visto.find(
                                (x) =>
                                    x.idSolicitud == record.solicitudId &&
                                    x.idstudio == record.id
                            ) != undefined &&
                            record.estatus === 4)&& (activiti == "cancel") ) && (
                        <Checkbox
                            onChange={(e) => {
                                onChange(e, record.id, record.solicitudId);
                                stcambio(!cambio);
                            }}
                            checked={
                                updateData
                                    .find(
                                        (x) =>
                                            x.solicitudId == record.solicitudId
                                    )
                                    ?.estudioId.includes(record.id) ||
                                (cambio &&
                                    updateData
                                        .find(
                                            (x) =>
                                                x.solicitudId ==
                                                record.solicitudId
                                        )
                                        ?.estudioId.includes(record.id))
                            }
                            disabled={!(activiti == "register")}
                        ></Checkbox>
                    )}
                    {updateData
                        .find((x) => x.solicitudId == record.solicitudId)
                        ?.estudioId.includes(record.id) ||
                    (cambio &&
                        updateData
                            .find((x) => x.solicitudId == record.solicitudId)
                            ?.estudioId.includes(record.id))
                        ? ""
                        : ""}
                    {record.estatus === 5 && (activiti == "cancel") &&(
                        <Checkbox
                            onChange={(e) => {
                                {
                                    onChange(e, record.id, record.solicitudId);
                                    stcambio(!cambio);
                                }
                            }}
                            checked={
                                updateData
                                    .find(
                                        (x) =>
                                            x.solicitudId == record.solicitudId
                                    )
                                    ?.estudioId.includes(record.id) ||
                                (cambio &&
                                    updateData
                                        .find(
                                            (x) =>
                                                x.solicitudId ==
                                                record.solicitudId
                                        )
                                        ?.estudioId.includes(record.id))
                            }
                            disabled={!(activiti == "cancel")}
                        ></Checkbox>
                    )}

                    {record.estatus === 4 && activiti == "register" && (
                        <EyeOutlined
                            style={{ marginLeft: "20%" }}
                            key="imprimir"
                            onClick={async () => {
                                const sendFiles = {
                                    mediosEnvio: ["selectSendMethods"],
                                    estudios: [
                                        {
                                            solicitudId: record.solicitudId,
                                            EstudiosId: [
                                                { EstudioId: record.id },
                                            ],
                                        },
                                    ],
                                };
                                var vistos = visto;
                                vistos.push({
                                    idSolicitud: record.solicitudId,
                                    idstudio: record.id,
                                });

                                console.log(vistos, "vistos");
                                await viewTicket(sendFiles);
                                setvisto(vistos);
                                setver(!ver);
                            }}
                        />
                    )}
                </>
            ),
        },
    ];

    return {
        expandedRowRender: (item: Ivalidationlist, index: any) => (
            <Table
                columns={nestedColumns}
                dataSource={item.estudios}
                pagination={false}
                className="header-expandable-table"
                showHeader={index === 0}
            />
        ),
        rowExpandable: () => true,
        defaultExpandAllRows: true,
    };
};

export default ValidationStudyColumns;
