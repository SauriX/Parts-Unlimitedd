import { Col, Image, Row, Table, Typography } from "antd";
import { useEffect, useState } from "react";
import {
  defaultPaginationProperties,
  getDefaultColumnProps,
  IColumns,
  ISearch,
} from "../../../app/common/table/utils";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { IRequestInfo, IRequestStudyInfo } from "../../../app/models/request";
import { moneyFormatter } from "../../../app/util/utils";
import views from "../../../app/util/view";
import moment from "moment";

const { Link, Text } = Typography;

const logoWee = `/${process.env.REACT_APP_NAME}/admin/assets/logos/weeclinic.png`;

const RequestTable = () => {
  const { requestStore } = useStore();
  const { loadingRequests, requests, getRequests: getByFilter } = requestStore;

  let navigate = useNavigate();

  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });

  useEffect(() => {
    const readRequests = async () => {
      await getByFilter({
        tipoFecha: 1,
        fechaInicial: moment().utcOffset(0, true),
        fechaFinal: moment().utcOffset(0, true),
      });
    };

    readRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns: IColumns<IRequestInfo> = [
    {
      ...getDefaultColumnProps("clave", "Clave", {
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
            <Text type="secondary">{item.clavePatologica}</Text>
          </small>
        </div>
      ),
    },
    {
      ...getDefaultColumnProps("afiliacion", "Afiliación", {
        searchState,
        setSearchState,
        width: 180,
      }),
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
      ...getDefaultColumnProps("compañia", "Compañia", {
        searchState,
        setSearchState,
        width: 180,
      }),
      ellipsis: {
        showTitle: false,
      },
    },
    {
      ...getDefaultColumnProps("procedencia", "Procedencia", {
        searchState,
        setSearchState,
        width: 180,
      }),
      ellipsis: {
        showTitle: false,
      },
    },
    {
      ...getDefaultColumnProps("importe", "Importe", {
        searchState,
        setSearchState,
        width: 120,
      }),
      align: "right",
      render: (value) => moneyFormatter.format(value),
    },
    {
      ...getDefaultColumnProps("descuento", "Descuento", {
        searchState,
        setSearchState,
        width: 120,
      }),
      align: "right",
      render: (value) => moneyFormatter.format(value),
    },
    {
      ...getDefaultColumnProps("total", "Total", {
        searchState,
        setSearchState,
        width: 120,
      }),
      align: "right",
      render: (value) => moneyFormatter.format(value),
    },
    {
      ...getDefaultColumnProps("saldo", "Saldo", {
        searchState,
        setSearchState,
        width: 120,
      }),
      align: "right",
      render: (value) => moneyFormatter.format(value),
    },
    {
      key: "estudios",
      dataIndex: "estudios",
      title: "Estudios",
      align: "center",
      width: 180,
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
    {
      key: "esWeeClinic",
      dataIndex: "esWeeClinic",
      width: 40,
      fixed: "right",
      render: (value) => (value ? <Image src={logoWee} /> : ""),
    },
  ];

  return (
    <Table<IRequestInfo>
      size="small"
      loading={loadingRequests}
      rowKey={(record) => record.solicitudId}
      columns={columns}
      dataSource={[...requests]}
      pagination={defaultPaginationProperties}
      sticky
      scroll={{ x: "fit-content" }}
      expandable={{
        expandedRowRender: (record) => (
          <Row align="middle" gutter={[25, 25]}>
            {record.estudios.map((x) => (
              <Col
                key={x.clave + x.estatus}
                style={{ display: "flex", alignItems: "center" }}
              >
                {x.nombre}{" "}
                <ContainerBadge color={x.color} text={x.estatus[0]} />
              </Col>
            ))}
          </Row>
        ),
        rowExpandable: (record) => record.estudios.length > 0,
      }}
    />
  );
};

export default observer(RequestTable);

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
