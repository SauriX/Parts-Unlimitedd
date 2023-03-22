import { Col, Image, Row, Table, Typography } from "antd";
import { useEffect, useState } from "react";
import {
  defaultPaginationProperties,
  getDefaultColumnProps,
  IColumns,
  ISearch,
} from "../../../app/common/table/utils";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { IRequestInfo, IRequestStudyInfo } from "../../../app/models/request";
import { moneyFormatter } from "../../../app/util/utils";
import views from "../../../app/util/view";
import {
  IReportRequestInfo,
  IStudyReportInfo,
} from "../../../app/models/ReportRequest";

const { Link, Text } = Typography;

const logoWee = `${process.env.REACT_APP_NAME}/assets/logos/weeclinic.png`;

const ReportTable = () => {
  const { reportStudyStore } = useStore();
  const {
    loadingRequests,
    filter,
    lastViewedFrom,
    requests,
    setFilter,
    getRequests,
  } = reportStudyStore;

  let navigate = useNavigate();

  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });

  useEffect(() => {
    const readRequests = async () => {
      const defaultCode = !lastViewedFrom
        ? undefined
        : lastViewedFrom.from === "requests"
        ? undefined
        : lastViewedFrom.code;
      setFilter({ ...filter, clave: defaultCode ?? filter.clave });
      await getRequests({ ...filter, clave: defaultCode ?? filter.clave });
    };

    readRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns: IColumns<IReportRequestInfo> = [
    {
      ...getDefaultColumnProps("solicitud", "Clave", {
        searchState,
        setSearchState,
        width: 150,
      }),
      render: (value, item) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Link
            onClick={() => {
              navigate(
                `/${views.request}/${item.expedienteId}/${item.solicitudId}`
              );
            }}
          >
            {value}
          </Link>
          <small>
            <Text type="secondary" style={{color:item.estatus==="Ruta"?"#00FF80":item.estatus==="Urgente"?"#FF8000":item.estatus!="Normal"?"#AE7BEE":""}}>{item.estatus}</Text>
          </small>
        </div>
      ),
    },
    {
      ...getDefaultColumnProps("paciente", "Paciente", {
        searchState,
        setSearchState,
        width: 240,
      }),
      ellipsis: {
        showTitle: false,
      },
    },
    {
      ...getDefaultColumnProps("edad", "Edad", {
        searchState,
        setSearchState,
        width: 180,
      }),
      ellipsis: {
        showTitle: false,
      },
    },
    {
      ...getDefaultColumnProps("sexo", "Sexo", {
        searchState,
        setSearchState,
        width: 180,
      }),
      ellipsis: {
        showTitle: false,
      },
    },
    {
      ...getDefaultColumnProps("sucursal", "Sucursal origen", {
        searchState,
        setSearchState,
        width: 180,
      }),
      render: (value) => value,
    },
    {
      ...getDefaultColumnProps("medico", "Médico", {
        searchState,
        setSearchState,
        width: 240,
      }),
      render: (value) => value,
    },
    {
      ...getDefaultColumnProps("tipo", "Tipo de Solicitud", {
        searchState,
        setSearchState,
        width: 200,
      }),
      render: (value) => value,
    },
    {
      ...getDefaultColumnProps("compañia", "Compañía", {
        searchState,
        setSearchState,
        width: 180,
      }),
      render: (value) => value,
    },
    {
      ...getDefaultColumnProps("entrega", "Fecha de entrega", {
        searchState,
        setSearchState,
        width: 180,
      }),
      render: (value) => value,
    },
     {
      key: "estudios",
      dataIndex: "estudios",
      title: "Estudios",
      width: 240,
      render: (value: IRequestStudyInfo[]) => (
        <Row align="middle">
          {value.map((x, i) => (
            <Col
              key={x.clave + x.estatus}
              style={{ display: "flex", alignItems: "center" }}
            >
              <ContainerBadge color={x.color} text={x.estatus[0]} />
            </Col>
          ))}
        </Row>
      ),
    },
  ];
  const nestedcolumns: IColumns<IStudyReportInfo> = [
    {
      ...getDefaultColumnProps("nombre", "Estudio", {
        searchState,
        setSearchState,
        width: 150,
      }),
      render: (value, item) => (
        <div style={{ display: "inline", flexDirection: "column" }}>
          {value}
          <ContainerBadge color={"#FF9F40"} text={item.estatus[0]} />
        </div>
      ),
    },

    {
      ...getDefaultColumnProps("estatus", "Estatus", {
        searchState,
        setSearchState,
        width: 180,
      }),
      ellipsis: {
        showTitle: false,
      },
    },
    {
      ...getDefaultColumnProps("fecha", "Fecha de entrega", {
        searchState,
        setSearchState,
        width: 180,
      }),
      ellipsis: {
        showTitle: false,
      },
    },     
  ];
  return (
    <Table<IReportRequestInfo>
      size="small"
      loading={loadingRequests}
      rowKey={(record) => record.solicitudId}
      columns={columns}
      dataSource={[...requests]}
      pagination={defaultPaginationProperties}
      sticky
      scroll={{ x: "fit-content" }}
      expandable={{
        expandedRowRender: (record, index) => (
          <Table
          rowKey={(records)=> records.idStudio +  records.estatus }
          columns={nestedcolumns}
          dataSource={record.estudios}
          pagination={false}
          className="header-expandable-table"
          showHeader={false}
        />
        ),
        rowExpandable: (record) => record.estudios.length > 0,
      }}
    />
  );
};

export default observer(ReportTable);

const ContainerBadge = ({ color, text }: { color: string; text?: string }) => {
  return (
    <div
      className="badge-container-large"
      style={{
        marginLeft: 10,
        display: "inline-block",
        backgroundColor: color,
      }}
    >
      {text}
    </div>
  );
};
