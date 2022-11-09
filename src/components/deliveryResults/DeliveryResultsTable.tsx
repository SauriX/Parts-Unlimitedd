import { Button, Checkbox, Col, Descriptions, Divider, Row, Table } from "antd";
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import PrintIcon from "../../app/common/icons/PrintIcon";
import { IColumns } from "../../app/common/table/utils";
import { useStore } from "../../app/stores/store";

const dummyData = [
  {
    id: "1",
    solicitud: "123456",
    nombre: "Juan Perez",
    registro: "123456",
    sucursal: "Sucursal 1",
    edad: "30",
    sexo: "Masculino",
    compania: "Compañia 1",
    orden: "Orden 1",
  },
  {
    id: "2",
    solicitud: "123456",
    nombre: "Juan Perez",
    registro: "123456",
    sucursal: "Sucursal 1",
    edad: "30",
    sexo: "Masculino",
    compania: "Compañia 1",
    orden: "Orden 1",
  },
  {
    id: "3",
    solicitud: "123456",
    nombre: "Juan Perez",
    registro: "123456",
    sucursal: "Sucursal 1",
    edad: "30",
    sexo: "Masculino",
    compania: "Compañia 1",
    orden: "Orden 1",
  },
];

const DeliveryResultsTable = () => {
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  const { massResultSearchStore, requestedStudyStore } = useStore();
  const { requests } = massResultSearchStore;
  const { printOrder } = requestedStudyStore;
  const [selectedStudies, setSelectedStudies] = useState<any[]>([]);
  const columns: IColumns = [
    {
      key: "solicitudId",
      dataIndex: "solicitud",
      title: "Solicitud",
      align: "center",
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
      title: "Compañia",
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
  return (
    <>
      <Divider orientation="right">
        Solicitudes: {requests.length} - Estudios:{" "}
        {requests.reduce((acc, element) => acc + element?.estudios.length, 0)}
      </Divider>
      <Row justify="center">
        <Col>
          <Checkbox>Correo</Checkbox>
          <Checkbox>Whatsapp</Checkbox>
          <Checkbox>Fisico</Checkbox>
        </Col>
      </Row>
      <Row justify="end">
        <Col>
          <Button
            onClick={() => {
              console.log("selectedStudies", selectedStudies);
            }}
            type="primary"
          >
            Registrar
          </Button>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Table<any>
            size="small"
            rowKey={(record) => record.solicitudId}
            columns={columns}
            dataSource={[...requests]}
            pagination={false}
            scroll={{ x: 450 }}
            expandable={{
              onExpand: onExpand,
              expandedRowKeys: expandedRowKeys,
              expandedRowRender: (data: any) => (
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
                    rowSelection={{
                      type: "checkbox",
                      onSelect: (selectedRow, isSelected, a: any) => {
                        // console.log(
                        //   "selectedssssss row keys",
                        //   toJS(selectedRow)
                        // );
                        console.log("selectedtsss rows", toJS(isSelected));
                        // console.log("a", toJS(a));
                        if (isSelected) {
                          const existStudy = selectedStudies.find(
                            (study) => study.id === selectedRow.estudioId
                          );
                          if (!existStudy) {
                            const newStudy = {
                              id: selectedRow.estudioId,
                              tipo: selectedRow.isPathological
                                ? "PATHOLOGICAL"
                                : "LABORATORY",
                            };
                            setSelectedStudies([...selectedStudies, newStudy]);
                          }
                        } else {
                          const newStudies = selectedStudies.filter(
                            (study) => study.id !== selectedRow.estudioId
                          );
                          setSelectedStudies(newStudies);
                        }
                        // setSelectedStudies(selectedRowKeys);
                        // console.log("selected studies", selectedStudies);
                      },
                      onChange: (
                        selectedRowKeys: React.Key[],
                        selectedRows: any,
                        rowSelectedMethod: any
                      ) => {
                        console.log("selected row keys", toJS(selectedRowKeys));
                        console.log("selectedt rows", toJS(selectedRows));
                        console.log("a", toJS(rowSelectedMethod));
                        let newStudies: any[] = [];
                        if (rowSelectedMethod.type === "all") {
                          if (selectedRowKeys.length > 0) {
                            selectedRowKeys.forEach((key) => {
                              const existStudy = selectedStudies.find(
                                (study) => study.id === key
                              );
                              if (!existStudy) {
                                newStudies.push({
                                  id: key,
                                  tipo: selectedRows.find(
                                    (row: any) => row.estudioId === key
                                  ).isPathological
                                    ? "PATHOLOGICAL"
                                    : "LABORATORY",
                                });
                              }
                            });
                            setSelectedStudies([
                              ...selectedStudies,
                              ...newStudies,
                            ]);
                          } else {
                            const idStudies = data.estudios.map(
                              (estudio: any) => estudio.estudioId
                            );
                            newStudies = selectedStudies.filter(
                              (study) => !idStudies.includes(study.id)
                            );

                            setSelectedStudies(newStudies);
                          }
                        }
                      },
                      // selectedRowKeys: selectedStudies,
                    }}
                  ></Table>
                </>
              ),
              rowExpandable: () => true,
              defaultExpandAllRows: true,
            }}
            bordered
          ></Table>
        </Col>
      </Row>
    </>
  );
};
export default observer(DeliveryResultsTable);
