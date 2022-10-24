import { Col, Row, Table, Typography } from "antd";
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

const { Link } = Typography;

const MassSearchTable = () => {
  const { width: windowWidth } = useWindowDimensions();
  const { massResultSearchStore } = useStore();
  const { parameters, results } = massResultSearchStore;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });
  const [columnas, setColumnas] = useState<any>([]);
  useEffect(() => {
    const cols = parameters.map((parameter: IParameter) => {
      return {
        ...getDefaultColumnProps("clave", "Clave", {
          searchState,
          setSearchState,
          width: 120,
          //   minWidth: "20em",
        }),
        align: "center",
        key: uuid(),
        render: (clave: any, row: IResult) => {
          let param = row.parameters.find(
            (p: IParameter) => p.nombre === parameter.nombre
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
                <Col>{parameter.nombre}</Col>
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
        width: 225,
        // minWidth: "20em",
        // windowSize: windowWidth,
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
                    console.log(
                      "enlace",
                      `/clinicResultsDetails/${row.expedienteId}/${row.id}`
                    );
                    navigate(
                      `/clinicResultsDetails/${row.expedienteId}/${row.id}`
                    );
                  }}
                >
                  {row.clave}
                </Link>
              </Col>
            </Row>
            {/* <Row>
              <Col>
                <strong>{row.paciente}</strong>
              </Col>
            </Row>
            <Row>
              <Col>
                {row.edad} años -<span> Genero: {row.genero}</span>
              </Col>
            </Row> */}
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
    <>
      <Table
        key={uuid()}
        rowKey={uuid()}
        loading={loading}
        size="small"
        columns={columns}
        bordered
        rowSelection={{
          type: "checkbox",
          columnWidth: 40,

          onChange: () => {},

          renderCell: () => {
            return (
              <>
                <Row>
                  <CheckInput />
                  <PrintIcon key="doc" onClick={() => {}} />
                  {/* <Col></Col> */}
                </Row>
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
    </>
  );
};
export default observer(MassSearchTable);
