import { Checkbox, Col, Row, Spin, Table, Typography } from "antd";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import CheckInput from "../../app/common/form/CheckInput";
import PrintIcon from "../../app/common/icons/PrintIcon";
import { v4 as uuid } from "uuid";
import {
  getDefaultColumnProps,
  IColumns,
  ISearch,
} from "../../app/common/table/utils";
import {
  IParameter,
  IResult,
  IResultList,
} from "../../app/models/massResultSearch";
import { useStore } from "../../app/stores/store";
import useWindowDimensions, { resizeWidth } from "../../app/util/window";
import { ppid } from "process";
import { useNavigate } from "react-router-dom";
import React from "react";
import moment from "moment";
import { toJS } from "mobx";

const { Link } = Typography;

type MSDefaultProps = {
  printing: boolean;
};

const MassSearchTable = ({ printing }: MSDefaultProps) => {
  const { width: windowWidth } = useWindowDimensions();
  const { massResultSearchStore } = useStore();
  const { parameters, results, loadingStudies, printOrder } =
    massResultSearchStore;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });
  const [columnas, setColumnas] = useState<any>([]);
  const [selected, setSelected] = useState<any[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);

  useEffect(() => {
    const cols = parameters.map((parameter: IParameter) => {
      return {
        ...getDefaultColumnProps("clave", "Clave", {
          searchState,
          setSearchState,
          width: 120,
        }),
        align: "center",
        key: uuid(),
        render: (clave: any, row: IResult) => {
          let param = row.parameters.find(
            (p: IParameter) => p.tipoValorId === parameter.tipoValorId
          );
          return {
            props: {
              style: { background: !!param ? "" : "#cfd0d1" },
            },
            children: !!param ? param.valor : "",
          };
        },
        title: () => {
          return (
            <>
              <Row>
                <Col>
                  {!!parameter.nombre ? parameter.nombre : parameter.clave}
                </Col>
              </Row>
              <Row>
                <Col>
                  <strong>{parameter.unidades}</strong>
                </Col>
              </Row>
            </>
          );
        },
      };
    });
    setColumnas(cols);
  }, [parameters]);

  const columns: IColumns<any> = [
    {
      ...getDefaultColumnProps("clave", "Información del paciente", {
        searchState,
        setSearchState,
        width: 150,
      }),
      align: "left",
      key: uuid(),
      render: (value, row: IResult) => {
        return (
          <>
            <Row>
              <Col>
                <Link
                  onClick={() => {
                    navigate(
                      `/clinicResultsDetails/${row.expedienteId}/${row.id}`
                    );
                  }}
                >
                  {row.clave}
                </Link>
              </Col>
            </Row>
            <Row>
              <Col>
                <strong>Estudio: </strong>
                {row.nombreEstudio}
              </Col>
            </Row>
          </>
        );
      },

      fixed: "left",
    },
    ...columnas,
  ];
  return (
    <Spin spinning={loading || printing} tip={printing ? "Descargando" : ""}>
      <Table
        key={uuid()}
        rowKey={(row) => row.reuqestStudyId}
        loading={loadingStudies}
        size="small"
        columns={columns}
        bordered
        rowSelection={{
          selectedRowKeys,
          type: "checkbox",
          columnWidth: 40,

          onChange: (selectedRow) => {
            setSelectedRowKeys([...selectedRow]);
          },
          onSelect: () => {
            console.log("hola mundo");
          },
          renderCell: (cel, request: IResult) => {
            return (
              <>
                <Col>
                  <div>
                    <Checkbox
                      style={{ marginBottom: 0, paddingBottom: 0 }}
                      checked={selectedRowKeys.includes(request.reuqestStudyId)}
                      onClick={(e) => {
                        if (selectedRowKeys.includes(request.reuqestStudyId)) {
                          setSelectedRowKeys((current) =>
                            current.filter(
                              (row) => row.id !== request.reuqestStudyId
                            )
                          );
                        } else {
                          selectedRowKeys.push(request.reuqestStudyId);
                        }
                      }}
                    />
                  </div>
                  <PrintIcon
                    key="doc"
                    onClick={() => {
                      printOrder(request.expedienteId, request.id);
                    }}
                  />
                </Col>
              </>
            );
          },
        }}
        scroll={{
          y: 500,
          x: "max-content",
        }}
        sticky
        pagination={false}
        dataSource={results}
      ></Table>
    </Spin>
  );
};
export default observer(MassSearchTable);
