import {
  Button,
  Checkbox,
  Col,
  Divider,
  PageHeader,
  Row,
  Spin,
  Table,
  Typography,
} from "antd";
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { useState, FC } from "react";
import PrintIcon from "../../app/common/icons/PrintIcon";
import { IColumns, getDefaultColumnProps } from "../../app/common/table/utils";
import { useStore } from "../../app/stores/store";
import type { CheckboxValueType } from "antd/es/checkbox/Group";
import HeaderTitle from "../../app/common/header/HeaderTitle";
import alerts from "../../app/util/alerts";
import { useNavigate } from "react-router-dom";
import { moneyFormatter } from "../../app/util/utils";
import {
  WhatsAppOutlined,
  MailOutlined,
  FolderOpenOutlined,
} from "@ant-design/icons";
import { IRequestedStudyList } from "../../app/models/requestedStudy";

const { Link, Text } = Typography;

type DeliveryResultsTableProps = {
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
};

const DeliveryResultsTable: FC<DeliveryResultsTableProps> = ({
  componentRef,
}) => {
  const navigate = useNavigate();
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  const { massResultSearchStore, requestedStudyStore, clinicResultsStore } =
    useStore();
  const { sendResultFile } = clinicResultsStore;
  const { requests, formDeliverResult, getAllCaptureResults } =
    massResultSearchStore;
  const { printOrder } = requestedStudyStore;
  const [loading, setLoading] = useState(false);
  const [selectedStudies, setSelectedStudies] = useState<any[]>([]);
  const [selectSendMethods, setSelectSendMethods] = useState<
    CheckboxValueType[]
  >([]);
  const [selectedRowKeysCheck, setSelectedRowKeysCheck] = useState<any[]>([]);
  const [openRows, setOpenRows] = useState<boolean>(false);
  useEffect(() => {
    setExpandedRowKeys(requests.map((x) => x.solicitudId));
    setOpenRows(true);
  }, [requests]);

  const columns: IColumns<IRequestedStudyList> = [
    {
      key: "solicitudId",
      dataIndex: "solicitud",
      title: "Solicitud",
      align: "center",
      render(value, record: any, index) {
        // console.log("record", record);
        return (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Link
              onClick={() => {
                navigate(
                  `/clinicResultsDetails/${record?.expedienteId}/${record?.solicitudId}`
                );
              }}
            >
              {record.solicitud}
            </Link>
            <small>
              <Text type="secondary">
                <Text strong>{record?.clavePatologica}</Text>
              </Text>
            </small>
          </div>
        );
      },
    },
    {
      ...getDefaultColumnProps("nombre", "Nombre del Paciente", {
        width: "30%",
      }),
      render: (value, item) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Text style={{ fontWeight: "bolder", marginBottom: -5 }}>{value}</Text>
          {item.sucursal} {item.edad} años {item.sexo[0]}
        </div>
      ),
    },

    {
      key: "solicitudId",
      dataIndex: "registro",
      title: "Registro",
      align: "center",
    },

    {
      key: "solicitudId",
      dataIndex: "compania",
      title: "Compañía",
      align: "center",
    },
    {
      key: "solicitudId",
      dataIndex: "parcialidad",
      title: "Parcialidad",
      align: "center",
    },

    {
      key: "solicitudId",
      dataIndex: "orden",
      title: "Orden",
      align: "center",
      render: (data: any, row: any) => {
        return (
          <PrintIcon
            key="print"
            onClick={() => {
              console.log("row", toJS(row));
              printOrder(row.expedienteId!, row.solicitudId!);
            }}
          ></PrintIcon>
        );
      },
    },
  ];

  const options = [
    { label: "Correo", value: "Correo" },
    { label: "Whatsapp", value: "Whatsapp" },
    { label: "Fisico", value: "Fisico" },
  ];
  const columnsStudyState = (estudios: any) => {
    const columnsStudy: any = [
      {
        key: "estudioId",
        dataIndex: "estudio",
        title: "Estudio",
        align: "center",
        width: 400,
      },
      {
        key: "estudioId",
        dataIndex: "medioSolicitado",
        title: "Medio Disponibles/Enviados",
        align: "center",
        width: 150,
        render: (value: any, b: any, c: any) => {
          const elements: any[] = [];
          if (!!estudios.envioCorreo) {
            if (!!value && value.split(",").includes("Correo")) {
              elements.push(
                <>
                  <MailOutlined style={{ color: "#d11717" }} />
                </>
              );
            } else {
              elements.push(
                <>
                  <MailOutlined />
                </>
              );
            }
          }
          if (!!estudios.envioWhatsapp) {
            if (!!value && value.split(",").includes("Whatsapp")) {
              elements.push(
                <>
                  <WhatsAppOutlined
                    style={{ color: "#17d120", paddingLeft: 10 }}
                  />
                </>
              );
            } else {
              elements.push(
                <>
                  <WhatsAppOutlined style={{ paddingLeft: 10 }} />
                </>
              );
            }
          }
          if (!!value && value.split(",").includes("Fisico")) {
            elements.push(
              <>
                <FolderOpenOutlined
                  style={{ color: "#1774d1", paddingLeft: 10 }}
                />
              </>
            );
          } else {
            elements.push(
              <>
                <FolderOpenOutlined style={{ paddingLeft: 10 }} />
              </>
            );
          }
          return <>{elements}</>;
        },
      },
      {
        key: "estudioId",
        dataIndex: "fechaEntrega",
        title: "Fecha de Entrega",
        align: "center",
        width: 200,
      },
      {
        key: "estudioId",
        dataIndex: "estatus",
        title: "Estatus",
        align: "center",
        width: 200,
      },
      {
        key: "estudioId",
        dataIndex: "registro",
        title: "Registro",
        align: "center",
        width: 300,
      },
    ];
    return columnsStudy;
  };
  const onChange = (checkedValues: CheckboxValueType[]) => {
    console.log("checked = ", checkedValues);
    setSelectSendMethods(checkedValues);
  };
  const toggleRow = () => {
    if (openRows) {
      setOpenRows(false);
      setExpandedRowKeys([]);
    } else {
      setOpenRows(true);
      setExpandedRowKeys(requests.map((x) => x.solicitudId));
    }
  };
  const onExpand = (isExpanded: boolean, record: any) => {
    let expandRows: string[] = expandedRowKeys;
    if (isExpanded) {
      expandRows.push(record.solicitudId);
    } else {
      const index = expandRows.findIndex((x) => x === record.solicitudId);
      if (index > -1) {
        expandRows.splice(index, 1);
      }
    }
    setExpandedRowKeys(expandRows);
  };
  const DeliveryResultsTablePrint = () => {
    return (
      <div ref={componentRef}>
        <PageHeader
          ghost={false}
          title={<HeaderTitle title="Busqueda de captura de resultados" />}
          className="header-container"
        ></PageHeader>
        <Divider className="header-divider" />
        <Table<any>
          size="small"
          rowKey={(record) => record.id}
          columns={columns.slice(0, 7)}
          pagination={false}
          dataSource={[...requests]}
        />
      </div>
    );
  };
  return (
    <>
      <Divider />
      <Row justify="center">
        <Col>
          <Checkbox.Group
            options={options}
            onChange={onChange}
            value={selectSendMethods}
          />
        </Col>
      </Row>
      <Row justify="end" style={{ marginBottom: 10 }}>
        <Col>
          <Button
            onClick={async () => {
              const solicitudesId = selectedStudies.map(
                (study) => study.solicitudId
              );

              let saldosPendientes: any[] = [];
              let solicitudesSinMedios: any[] = [];
              requests
                .filter((x) => solicitudesId.includes(x.solicitudId))
                .forEach((request) => {
                  if (request.saldoPendiente) {
                    saldosPendientes.push({
                      clave: request.solicitud,
                      saldo: moneyFormatter.format(request.saldo ?? 0),
                    });
                  }
                  if (
                    selectSendMethods.includes("Correo") &&
                    !request.envioCorreo
                  ) {
                    // if (!request.envioWhatsapp) {
                    solicitudesSinMedios.push({
                      clave: request.solicitud,
                      medio: `${
                        !request.envioWhatsapp && !request.envioCorreo
                          ? "WhatsApp/Correo"
                          : !request.envioWhatsapp
                          ? "WhatsApp"
                          : !request.envioCorreo
                          ? "Correo"
                          : ""
                      }`,
                    });
                    // }
                  }
                  if (
                    selectSendMethods.includes("Whatsapp") &&
                    !request.envioWhatsapp
                  ) {
                    // if (!request.envioCorreo) {
                    solicitudesSinMedios.push({
                      clave: request.solicitud,
                      medio: `${
                        !request.envioWhatsapp && !request.envioCorreo
                          ? "WhatsApp/Correo"
                          : !request.envioWhatsapp
                          ? "WhatsApp"
                          : !request.envioCorreo
                          ? "Correo"
                          : ""
                      }`,
                    });
                    // }
                  }
                });
              console.log("medios", selectSendMethods);
              console.log("solicitudessinmedios", solicitudesSinMedios);
              if (!!solicitudesSinMedios.length) {
                alerts.confirmInfo(
                  "Datos faltantes",
                  <>
                    <Col>
                      <div>Solicitudes con datos faltantes</div>
                      {solicitudesSinMedios.map((solicitudSinMedio) => {
                        return (
                          <div>
                            {solicitudSinMedio?.clave} -{" "}
                            {solicitudSinMedio?.medio}
                          </div>
                        );
                      })}
                    </Col>
                  </>,
                  async () => console.log("si")
                );
                return;
              }
              if (!!saldosPendientes.length) {
                alerts.confirm(
                  "Solicitudes con saldo pendiente",
                  <>
                    <Col>
                      <div>Solicitudes con saldo pendiente</div>
                      {saldosPendientes.map((saldoPendiente) => {
                        return (
                          <div>
                            {saldoPendiente?.clave} - {saldoPendiente?.saldo}
                          </div>
                        );
                      })}
                    </Col>
                  </>,
                  async () => {
                    setLoading(true);
                    const sendFiles = {
                      mediosEnvio: selectSendMethods,
                      estudios: selectedStudies,
                    };

                    await sendResultFile(sendFiles);
                    setSelectSendMethods([]);
                    setSelectedStudies([]);
                    setSelectedRowKeysCheck([]);
                    await getAllCaptureResults(formDeliverResult);
                    setLoading(false);
                  },
                  () => true
                );
              } else {
                setLoading(true);
                const sendFiles = {
                  mediosEnvio: selectSendMethods,
                  estudios: selectedStudies,
                };

                await sendResultFile(sendFiles);
                setSelectSendMethods([]);
                setSelectedStudies([]);
                setSelectedRowKeysCheck([]);
                await getAllCaptureResults(formDeliverResult);
                setLoading(false);
              }
            }}
            disabled={!selectedStudies.length || !selectSendMethods.length}
            type="primary"
          >
            Registrar
          </Button>
        </Col>
        <Col>
          <Button type="primary" onClick={toggleRow} style={{ marginLeft: 10 }}>
            {!openRows ? "Expandir tabla" : "Contraer tabla"}
          </Button>
        </Col>
      </Row>

      <Spin spinning={loading}>
        <Row>
          <Col span={24}>
            <Table<any>
              size="small"
              rowKey={(record) => record.solicitudId}
              columns={columns}
              dataSource={[...requests]}
              rowClassName="row-search"
              expandable={{
                onExpand: onExpand,
                expandedRowKeys: expandedRowKeys,
                rowExpandable: () => true,
                defaultExpandAllRows: true,

                expandedRowRender: (data: any, index: number) => (
                  <>
                    <Table<any>
                      size="small"
                      rowKey={(record) => record.estudioId}
                      columns={columnsStudyState(data)}
                      dataSource={[...data.estudios]}
                      bordered
                      style={{}}
                      className="header-expandable-table"
                      pagination={false}
                      showHeader={index === 0}
                      rowSelection={{
                        type: "checkbox",
                        getCheckboxProps: (record: any) => ({
                          disabled: !record.isActiveCheckbox,
                        }),
                        onSelect: (selectedRow, isSelected, a: any) => {
                          let existingStudy = null;
                          if (!!selectedStudies.length) {
                            existingStudy = selectedStudies.find(
                              (study) => study.solicitudId === data.solicitudId
                            );
                          }
                          if (isSelected) {
                            if (!existingStudy) {
                              const newStudy = {
                                estudioId: selectedRow.estudioId,
                                tipo: selectedRow.isPathological ? 30 : -1,
                              };
                              const newResquestStudies = {
                                solicitudId: data.solicitudId,
                                estudiosId: [newStudy],
                              };
                              setSelectedStudies([
                                ...selectedStudies,
                                newResquestStudies,
                              ]);
                            } else {
                              existingStudy.estudiosId.push({
                                estudioId: selectedRow.estudioId,
                                tipo: selectedRow.isPathological ? 30 : -1,
                              });
                            }
                          } else {
                            if (existingStudy) {
                              const newStudies =
                                existingStudy.estudiosId.filter(
                                  (study: any) =>
                                    study.estudioId !== selectedRow.estudioId
                                );
                              if (!!newStudies.length) {
                                existingStudy.estudiosId = newStudies;
                              } else {
                                const newRequest = selectedStudies.filter(
                                  (study: any) =>
                                    study.solicitudId !== data.solicitudId
                                );
                                setSelectedStudies(newRequest);
                              }
                            }
                          }
                        },
                        onChange: (
                          selectedRowKeys: React.Key[],
                          selectedRows: any,
                          rowSelectedMethod: any
                        ) => {
                          console.log(
                            "selected row keys",
                            toJS(selectedRowKeys)
                          );
                          setSelectedRowKeysCheck(selectedRowKeys);
                          console.log("selectedt rows", toJS(selectedRows));
                          console.log("a", toJS(rowSelectedMethod));
                          let newStudies: any[] = [];
                          if (rowSelectedMethod.type === "all") {
                            if (selectedRowKeys.length > 0) {
                              let existRequest = null;

                              let newResquestStudies = {
                                solicitudId: data.solicitudId,
                                estudiosId: [] as any[],
                              };
                              selectedRowKeys.forEach((key) => {
                                existRequest = selectedStudies.find(
                                  (study) =>
                                    study.solicitudId === data.solicitudId
                                );
                                if (!existRequest) {
                                  const newStudy: any = {
                                    estudioId: key,
                                    tipo: selectedRows[0].isPathological
                                      ? 30
                                      : -1,
                                  };
                                  newResquestStudies.estudiosId.push(newStudy);
                                }
                              });
                              if (!existRequest) {
                                newStudies.push(newResquestStudies);
                              }
                              setSelectedStudies([
                                ...selectedStudies,
                                ...newStudies,
                              ]);
                            } else {
                              const newStudies = selectedStudies.filter(
                                (study) =>
                                  study.solicitudId !== data.solicitudId
                              );

                              setSelectedStudies(newStudies);
                            }
                          }
                        },
                        selectedRowKeys: selectedRowKeysCheck,
                      }}
                    ></Table>
                  </>
                ),
              }}
              bordered
            ></Table>
          </Col>
        </Row>
      </Spin>
      <div style={{ display: "none" }}>{<DeliveryResultsTablePrint />}</div>
    </>
  );
};
export default observer(DeliveryResultsTable);
