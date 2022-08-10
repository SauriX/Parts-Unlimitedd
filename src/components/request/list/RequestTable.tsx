import { Button, Col, Row, Table, Typography } from "antd";
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
import { IRequestInfo, IRequestStudy, IRequestStudyInfo } from "../../../app/models/request";
import { moneyFormatter } from "../../../app/util/utils";
import views from "../../../app/util/view";

const { Link } = Typography;

const RequestTable = () => {
  const { requestStore } = useStore();
  const { requests, getRequests: getByFilter } = requestStore;

  let navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });

  useEffect(() => {
    const readRequests = async () => {
      setLoading(true);
      await getByFilter({});
      setLoading(false);
    };

    readRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns: IColumns<IRequestInfo> = [
    {
      ...getDefaultColumnProps("clave", "Clave", {
        searchState,
        setSearchState,
        width: 120,
      }),
      render: (value, item) => (
        <Link
          onClick={() => {
            navigate(`/${views.request}/${item.expedienteId}/${item.solicitudId}`);
          }}
        >
          {value}
        </Link>
      ),
    },
    {
      ...getDefaultColumnProps("clavePatologica", "Clave Patológica", {
        searchState,
        setSearchState,
        width: 180,
      }),
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
    },
    {
      ...getDefaultColumnProps("compañia", "Compañia", {
        searchState,
        setSearchState,
        width: 180,
      }),
    },
    {
      ...getDefaultColumnProps("procedencia", "Procedencia", {
        searchState,
        setSearchState,
        width: 180,
      }),
    },
    {
      ...getDefaultColumnProps("factura", "Factura", {
        searchState,
        setSearchState,
        width: 180,
      }),
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
            <Col key={x.clave + x.estatus} style={{ display: "flex", alignItems: "center" }}>
              <ContainerBadge color={x.color} text={x.estatus[0]} />
            </Col>
          ))}
        </Row>
      ),
    },
  ];

  return (
    <Table<IRequestInfo>
      size="small"
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
              <Col key={x.clave + x.estatus} style={{ display: "flex", alignItems: "center" }}>
                {x.nombre} <ContainerBadge color={x.color} text={x.estatus[0]} />
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
      style={{ marginLeft: 10, display: "inline-block", backgroundColor: color }}
    >
      {text}
    </div>
  );
};
