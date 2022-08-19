import {
  Button,
  Divider,
  PageHeader,
  Spin,
  Table,
  List,
  Typography,
  Row,
  Col,
  Pagination,
  Form,
  Switch,
} from "antd";
import React, { FC, Fragment, useEffect, useRef, useState } from "react";
import {
  defaultPaginationProperties,
  getDefaultColumnProps,
  IColumns,
  ISearch,
} from "../../app/common/table/utils";
import useWindowDimensions, { resizeWidth } from "../../app/util/window";
import { EditOutlined,PrinterOutlined,EyeOutlined } from "@ant-design/icons";
import IconButton from "../../app/common/button/IconButton";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { IEquipmentList } from "../../app/models/equipment";
import { useStore } from "../../app/stores/store";
import { observer } from "mobx-react-lite";
import { useReactToPrint } from "react-to-print";
import HeaderTitle from "../../app/common/header/HeaderTitle";
import { IMantainList, ISearchMantain, SearchMantainValues } from "../../app/models/equipmentMantain";
import TextInput from "../../app/common/form/proposal/TextInput";
import DateRangeInput from "../../app/common/form/proposal/DateRangeInput";
import SwitchInput from "../../app/common/form/SwitchInput";
import moment from "moment";
// import Search from "antd/es/transfer/search";
// import Indications from "../../views/Indications";
const equipment:IMantainList[] = [
  {
    id:"1",
    clave:"test",
    fecha:moment(moment.now()),
    activo:true
  }
];
type EquipmentTableProps = {
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
  id: number;
};

const EquipmentMantainData: FC<EquipmentTableProps> = ({
  componentRef,
  printing,
  id
}) => {
/*   const { equipmentStore } = useStore();
  const { equipment, getAll } = equipmentStore;
 */
  const [searchParams] = useSearchParams();
  const [form] = Form.useForm<ISearchMantain>();

  const [values, setValues] = useState<ISearchMantain>(
    new SearchMantainValues()
  );
  let navigate = useNavigate();

  const { width: windowWidth } = useWindowDimensions();

  const [loading, setLoading] = useState(false);

  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });

  console.log("Table");

/*   useEffect(() => {
    const readEquipment = async () => {
      setLoading(true);
      await getAll(searchParams.get("search") ?? "all");
      setLoading(false);
    };

    readEquipment();
  }, [getAll, searchParams]); */

  const EquipmentTablePrint = () => {
    return (
      <div ref={componentRef}>
        <PageHeader
          ghost={false}
          title={
            <HeaderTitle
              title="Catálogo de Indicaciones"
              image="Indicaciones"
            />
          }
          className="header-container"
        ></PageHeader>
        <Divider className="header-divider" />

      </div>
    );
  };
  const columns: IColumns<IMantainList> = [
    {
      ...getDefaultColumnProps("clave", "Clave", {
        searchState,
        setSearchState,
        width: "15%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
      render: (value, user) => (
        <Button
          type="link"
          onClick={() => {
            navigate(
              `/equipment/${user.id}?${searchParams}&mode=readonly&search=${
                searchParams.get("search") ?? "all"
              }`
            );
          }}
        >
          {value}
        </Button>
      ),
    },
    {
      ...getDefaultColumnProps("fecha", "Fecha", {
        searchState,
        setSearchState,
        width: "20%",
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
          title="Editar equipo"
          icon={<EditOutlined />}
          onClick={() => {
            navigate(
              `/equipment/${value}?${searchParams}&mode=edit&search=${
                searchParams.get("search") ?? "all"
              }`
            );
          }}
        />
      ),
    },
    {
      key: "imprimir",
      dataIndex: "id",
      title: "Imprimir",
      align: "center",
      width: windowWidth < resizeWidth ? 100 : "10%",
      render: (value) => (
        <IconButton
          title="Editar equipo"
          icon={<PrinterOutlined />}
          onClick={() => {
            navigate(
              `/equipment/${value}?${searchParams}&mode=edit&search=${
                searchParams.get("search") ?? "all"
              }`
            );
          }}
        />
      ),
    },
    {
      key: "editar",
      dataIndex: "id",
      title: "Ver",
      align: "center",
      width: windowWidth < resizeWidth ? 100 : "10%",
      render: (value) => (
        <IconButton
          title="Editar equipo"
          icon={<EyeOutlined />}
          onClick={() => {
            navigate(
              `/equipment/${value}?${searchParams}&mode=edit&search=${
                searchParams.get("search") ?? "all"
              }`
            );
          }}
        />
      ),
    },

    {
      key: "editar",
      dataIndex: "id",
      title: "Activo",
      align: "center",
      width: windowWidth < resizeWidth ? 100 : "10%",
      render: (value) => (
        <Switch checked={value}></Switch>
      ),
    },

  ];
  return (
    <Spin spinning={loading || printing} tip={printing ? "Imprimiendo" : ""}>
      <Row style={{ marginBottom: 24 }}>
      {!!id && (
          <Col md={12} sm={24} xs={12} style={{ textAlign: "left" }}>
            <Pagination
              size="small"
              total={/* maquilador.length */4}
              pageSize={1}
              current={/* actualMaquilador() */1}
              onChange={() => {
               // prevnextMaquilador(value - 1);
              }}
            />
          </Col>
        )}
      </Row>
      <Row style={{ marginBottom: 24 }} gutter={[12,12]}>
        <Col md={10} sm={24} xs={12} style={{ textAlign: "center" }}>
            <div style={{backgroundColor:"#B4C7E7",textAlign:"justify", width:"30%",marginLeft:"50%"}}>
            Clave: INT400
            <br />  
            Nombre: INTEGRA400  
            <br /> 
            Serie: <Link to={""}>EAC654489902</Link>
            </div>
        </Col>
        <Col md={14} sm={24} xs={12} style={{ textAlign: "center" }}>
        <Form<ISearchMantain>
            
            form={form}
            name="equipment"
            initialValues={values}
            /* onFinish={onFinish} */
            scrollToFirstError
 /*            onFieldsChange={() => {
              setDisabled(
                !form.isFieldsTouched() ||
                  form.getFieldsError().filter(({ errors }) => errors.length)
                    .length > 0
              );
            }} */
          >
            <Row>
              <Col md={10} sm={24}>
                <DateRangeInput
                  formProps={{
                    name: "clave",
                    label: "Clave",
                  }}

                />
              </Col>
              <Col md={10} sm={24}>
                <TextInput
                    formProps={{
                      name: "nombre",
                      label: "Nombre",
                      labelCol:{span:10}
                    }}
                    max={100}
                    
                />
              </Col>
              <Col md={4} sm={24}>
                  <Button >Buscar</Button>
              </Col>
            </Row>
          </Form>
        </Col> 
      </Row>
      <Table<IMantainList>
        loading={loading || printing}
        size="small"
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={[...equipment]}
        pagination={defaultPaginationProperties}
        sticky
        scroll={{ x: windowWidth < resizeWidth ? "max-content" : "auto" }}
      />
    </Spin>
  );
};

export default observer(EquipmentMantainData);
