import {
  Button,
  Divider,
  PageHeader,
  Spin,
  Table,
  Form,
  Row,
  Col,
  Modal,
} from "antd";
import React, { FC, Fragment, useEffect, useRef, useState } from "react";
import {
  defaultPaginationProperties,
  getDefaultColumnProps,
  IColumns,
  ISearch,
} from "../../app/common/table/utils";
import { formItemLayout } from "../../app/util/utils";
import { IParameterList } from "../../app/models/parameter";
import useWindowDimensions, { resizeWidth } from "../../app/util/window";
import { EditOutlined, LockOutlined } from "@ant-design/icons";
import IconButton from "../../app/common/button/IconButton";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useStore } from "../../app/stores/store";
import { observer } from "mobx-react-lite";
import HeaderTitle from "../../app/common/header/HeaderTitle";
import { IStudyList } from "../../app/models/study";
import views from "../../app/util/view";
type StudyTableProps = {
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
};
const StudyTable: FC<StudyTableProps> = ({ componentRef, printing }) => {
  const { studyStore } = useStore();
  const { getAll, study } = studyStore;
  let navigate = useNavigate();
  let id = "";
  const { width: windowWidth } = useWindowDimensions();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });
  console.log("Table");
  useEffect(() => {
    const readUsers = async () => {
      setLoading(true);
      await getAll(searchParams.get("search") ?? "all");
      setLoading(false);
    };

    readUsers();
  }, [getAll, searchParams]);
  const columns: IColumns<IStudyList> = [
    //clave
    {
      ...getDefaultColumnProps("clave", "Clave", {
        searchState,
        setSearchState,
        width: 100,
        windowSize: windowWidth,
      }),
      render: (value, estudio) => (
        <Button
          type="link"
          onClick={() => {
            navigate(
              `/${views.study}/${estudio.id}?mode=ReadOnly&search=${
                searchParams.get("search") ?? "all"
              }`
            );
          }}
        >
          {value}
        </Button>
      ),
      fixed: "left",
    },
    //nombre
    {
      ...getDefaultColumnProps("nombre", "Nombre", {
        searchState,
        setSearchState,
        width: 200,
        windowSize: windowWidth,
      }),
    },
    //nombre corto
    {
      ...getDefaultColumnProps("titulo", "Título", {
        searchState,
        setSearchState,
        width: 200,

        windowSize: windowWidth,
      }),
    },
    //area
    {
      ...getDefaultColumnProps("area", "Área", {
        searchState,
        setSearchState,
        width: 200,

        windowSize: windowWidth,
      }),
    },
    //departamento
    {
      ...getDefaultColumnProps("departamento", "Departamento", {
        searchState,
        setSearchState,
        width: 200,

        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("formato", "Formato", {
        searchState,
        setSearchState,
        width: 200,

        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("maquilador", "Maquilador", {
        searchState,
        setSearchState,
        width: 200,

        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("metodo", "Método", {
        searchState,
        setSearchState,
        width: 200,

        windowSize: windowWidth,
      }),
    },
    {
      key: "activo",
      dataIndex: "activo",
      title: "Activo",
      align: "center",
      width: 100,
      render: (value) => (value ? "Sí" : "No"),
    },
    //editar
    {
      key: "editar",
      dataIndex: "id",
      title: "Editar",
      align: "center",
      width: 100,
      fixed: "right",
      render: (value, parameter) => (
        <IconButton
          title="Editar estudio"
          icon={<EditOutlined />}
          onClick={() => {
            navigate(
              `/${views.study}/${parameter.id}?search=${
                searchParams.get("search") ?? "all"
              }`
            );
          }}
        />
      ),
    },
  ];

  const ParameterTablePrint = () => {
    return (
      <div ref={componentRef}>
        <PageHeader
          ghost={false}
          title={<HeaderTitle title="Catálogo de Estudios" image="estudio" />}
          className="header-container"
        ></PageHeader>
        <Divider className="header-divider" />
        <Table<IStudyList>
          size="large"
          rowKey={(record) => record.id}
          columns={columns.slice(0, 6)}
          pagination={false}
          dataSource={[...study]}
        />
      </div>
    );
  };

  return (
    <Fragment>
      <Table<IStudyList>
        loading={loading}
        size="small"
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={[...study]}
        pagination={defaultPaginationProperties}
        sticky
        scroll={{ x: "max-content" }}
      />
      <div style={{ display: "none" }}>{<ParameterTablePrint />}</div>
    </Fragment>
  );
};

export default observer(StudyTable);
