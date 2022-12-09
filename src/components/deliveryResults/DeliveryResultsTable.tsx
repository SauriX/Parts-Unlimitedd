import {
  Button,
  Checkbox,
  Col,
  Descriptions,
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
import { IColumns } from "../../app/common/table/utils";
import { useStore } from "../../app/stores/store";
import type { CheckboxValueType } from "antd/es/checkbox/Group";
import HeaderTitle from "../../app/common/header/HeaderTitle";
import { useNavigate } from "react-router-dom";
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
  const [selectedStudies, setSelectedStudies] = useState<any[]>([
    // { solicitudId: "", estudiosId: [{ estudioId: "", tipo: 3 }] },
  ]);
  const [selectSendMethods, setSelectSendMethods] = useState<
    CheckboxValueType[]
  >([]);
  const [selectedRowKeysCheck, setSelectedRowKeysCheck] = useState<any[]>([]);
  const [openRows, setOpenRows] = useState<boolean>(false);
  useEffect(() => {
    setExpandedRowKeys(requests.map((x) => x.solicitudId));
    setOpenRows(true);
  }, [requests]);

  const columns: IColumns = [
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
      key: "solicitudId",
      dataIndex: "nombre",
      title: "Nombre",
      align: "center",
    },
    {
      key: "solicitudId",
      dataIndex: "registro",
      title: "Registro",
      align: "center",
    },
    {
      key: "solicitudId",
      dataIndex: "sucursal",
      title: "Sucursal",
      align: "center",
    },
    {
      key: "solicitudId",
      dataIndex: "edad",
      title: "Edad",
      align: "center",
    },
    {
      key: "solicitudId",
      dataIndex: "sexo",
      title: "Sexo",
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
  const columnsStudy: any = [
    {
      key: "estudioId",
      dataIndex: "estudio",
      title: "Estudio",
      align: "center",
    },
    {
      key: "estudioId",
      dataIndex: "medioSolicitado",
      title: "Medio Solicitado",
      align: "center",
    },
    {
      key: "estudioId",
      dataIndex: "fechaEntrega",
      title: "Fecha de Entrega",
      align: "center",
    },
    {
      key: "estudioId",
      dataIndex: "estatus",
      title: "Estatus",
      align: "center",
    },
    {
      key: "estudioId",
      dataIndex: "registro",
      title: "Registro",
      align: "center",
    },
  ];
  const options = [
    { label: "Correo", value: "Correo" },
    { label: "Whatsapp", value: "Whatsapp" },
    { label: "Fisico", value: "Fisico" },
  ];
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
      {/* <Divider orientation="right">
        {`${formDeliverResult.fechaInicial?.format(
          "DD-MMM-YYYY"
        )} - ${formDeliverResult.fechaFinal?.format("DD-MMM-YYYY")}`}
      </Divider> */}
      <Row justify="center">
        <Col>
          <Checkbox.Group
            options={options}
            onChange={onChange}
            value={selectSendMethods}
          />
          {/* <Checkbox>Correo</Checkbox>
          <Checkbox>Whatsapp</Checkbox>
          <Checkbox>Fisico</Checkbox> */}
        </Col>
      </Row>
      <Row justify="end" style={{ marginBottom: 10 }}>
        <Col>
          <Button
            onClick={async () => {
              const sendFiles = {
                mediosEnvio: selectSendMethods,
                estudios: selectedStudies,
              };
              // console.log("selectedStudies", sendFiles);
              console.log("selectedStudies", selectedStudies);

              setLoading(true);
              await sendResultFile(sendFiles);
              setSelectSendMethods([]);
              setSelectedStudies([]);
              setSelectedRowKeysCheck([]);
              await getAllCaptureResults(formDeliverResult);
              setLoading(false);
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
              // pagination={false}
              // scroll={{ x: 450 }}

              expandable={{
                onExpand: onExpand,
                expandedRowKeys: expandedRowKeys,
                rowExpandable: () => true,
                defaultExpandAllRows: true,

                expandedRowRender: (data: any, index: number) => (
                  <>
                    {/* {console.log("no se que data", toJS(data.estudios))} */}
                    <Table
                      size="small"
                      rowKey={(record) => record.estudioId}
                      columns={columnsStudy}
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
