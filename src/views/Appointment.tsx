import { Divider, Table, Tabs, Tooltip, Typography } from "antd";
import React, { useState } from "react";
import { PlusCircleOutlined, CalendarOutlined, CloseCircleOutlined, EditOutlined } from "@ant-design/icons";
import Agenda from "../app/common/agenda/Agenda";
import moment from "moment";
import {
  defaultPaginationProperties,
  getDefaultColumnProps,
  IColumns,
  ISearch,
} from "../app/common/table/utils";
import useWindowDimensions, { resizeWidth } from "../app/util/window";
import IconButton from "../app/common/button/IconButton";

const { TabPane } = Tabs;
const { Link, Text } = Typography;

const Appointment = () => {
  return (
    <>
      <Tabs tabPosition="left">
        <TabPane
          tab={
            <div>
              <PlusCircleOutlined style={{ marginRight: 10 }} />
              Generadas
            </div>
          }
          key="1"
        >
          <DemoTable />
        </TabPane>
        <TabPane
          tab={
            <div>
              <CalendarOutlined style={{ marginRight: 10 }} />
              Agendadas
            </div>
          }
          key="2"
        >
          Content of Tab 2
        </TabPane>
        <TabPane
          tab={
            <div>
              <CloseCircleOutlined style={{ marginRight: 10 }} />
              Canceladas
            </div>
          }
          key="3"
        >
          Content of Tab 3
        </TabPane>
      </Tabs>
      <Divider className="header-divider" />
      <Agenda
        startTime={moment("08:00", "HH:mm")}
        endTime={moment("19:00", "HH:mm")}
        interval={moment("00:30", "HH:mm")}
        defaultType="week"
        calendarHeight={"60vh"}
        columns={[]}
        events={[]}
        render={() => <div></div>}
      />
    </>
  );
};

export default Appointment;

const demoData = [
  {
    noSolicitud: 44555765,
    fecha: new Date(),
    direccion: "Av. Ruiz Cortinex, Valle Verde, Monterrey, Nuevo León",
    nombre: "Jose Ramirez",
    edad: 30,
    sexo: "Masculino",
  },
];

const DemoTable = () => {
  const { width: windowWidth } = useWindowDimensions();

  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });

  const columns: IColumns<any> = [
    {
      ...getDefaultColumnProps("noSolicitud", "Solicitud de cita", {
        searchState,
        setSearchState,
        width: "20%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
      render: (value) => <Link>{value}</Link>,
    },
    {
      ...getDefaultColumnProps("fecha", "Fecha", {
        searchState,
        setSearchState,
        width: "15%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("direccion", "Dirección", {
        searchState,
        setSearchState,
        width: "20%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
      ellipsis: {
        showTitle: false,
      },
      render: (value) => (
        <Tooltip placement="topLeft" title={value}>
          {value}
        </Tooltip>
      ),
    },
    {
      ...getDefaultColumnProps("nombre", "Nombre", {
        searchState,
        setSearchState,
        width: "20%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("info", "Datos", {
        searchState,
        setSearchState,
        width: "15%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      key: "editar",
      dataIndex: "id",
      title: "Editar",
      align: "center",
      width: windowWidth < resizeWidth ? 100 : "10%",
      render: (value) => (
        <IconButton
          title="Editar reactivo"
          icon={<EditOutlined />}
          onClick={() => {
            // navigate(`/${views.reagent}/${value}?${searchParams}&mode=edit`);
          }}
        />
      ),
    },
  ];

  return (
    <Table<any>
      size="small"
      rowKey={(record) => record.noSolicitud}
      columns={columns}
      dataSource={[...demoData]}
      pagination={defaultPaginationProperties}
      scroll={{ x: windowWidth < resizeWidth ? "max-content" : "auto" }}
    />
  );
};
