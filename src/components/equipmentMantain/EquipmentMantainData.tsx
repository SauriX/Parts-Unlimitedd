import { Button, Spin, Table, Row, Col, Form, Switch } from "antd";
import React, { FC, useEffect, useState } from "react";
import {
  defaultPaginationProperties,
  getDefaultColumnProps,
  IColumns,
  ISearch,
} from "../../app/common/table/utils";
import useWindowDimensions, { resizeWidth } from "../../app/util/window";
import { EditOutlined, PrinterOutlined, EyeOutlined } from "@ant-design/icons";
import IconButton from "../../app/common/button/IconButton";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useStore } from "../../app/stores/store";
import { observer } from "mobx-react-lite";
import {
  IMantainList,
  ISearchMantain,
  SearchMantainValues,
} from "../../app/models/equipmentMantain";
import TextInput from "../../app/common/form/proposal/TextInput";
import DateRangeInput from "../../app/common/form/proposal/DateRangeInput";

type EquipmentTableProps = {
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
  id: number;
};

const EquipmentMantainData: FC<EquipmentTableProps> = ({
  componentRef,
  printing,
  id,
}) => {
  const { equipmentMantainStore, equipmentStore } = useStore();
  const {
    
    getAlls,
    getequip,
    equip,
    setSearch,
    search,
    setiD,
    idEq,
    printTicket,
    updateStatus,
    exportForm
  } = equipmentMantainStore;
  const { equipment, getAll } = equipmentStore;
  const [searchParams] = useSearchParams();
  const [form] = Form.useForm<ISearchMantain>();

  const [values, setValues] = useState<ISearchMantain>(
    new SearchMantainValues()
  );
  let navigate = useNavigate();

  const { width: windowWidth } = useWindowDimensions();

  const [loading, setLoading] = useState(false);
const [ equipments,setEquipments]=useState<IMantainList[]>([]);
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });

  useEffect(() => {
    const readEquipment = async () => {
      setLoading(true);
      var equipo = await getequip(id);
      search!.idEquipo = equipo?.id!;
      var data = await getAlls(search!);
      console.log(data);
      setEquipments(data!);
      await getAll("all");
      setiD(id);
      setLoading(false);
    };

    readEquipment();
  }, [getAll, searchParams, getequip, getAlls]);

  const onFinish = async (newValues: ISearchMantain) => {
    const equipment = { ...search, ...newValues };
   setSearch(equipment);
   var data = await getAlls(equipment);
    setEquipments(data!);
  };

  const UpdateStatusChange = async (id:string)=>{
    var list = [...equipments]
    var equipment = list.find(x=>x.id===id);   
    equipment!.activo = !equipment!.activo;
    var index = list.findIndex(x=> x.id===id);
    list[index]=equipment!;
    setEquipments(list);

    await updateStatus(id);
  }
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
            navigate(`/equipmentMantain/edit/${id}/${user.id}?mode=readonly`);
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
            navigate(`/equipmentMantain/edit/${id}/${value}`);
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
      render: (value, item) => (
        <IconButton
          title=" Imprimir reporte"
          icon={<PrinterOutlined />}
          onClick={() => {
            exportForm(item.id);
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
          title="Visualizar registro"
          icon={<EyeOutlined />}
          onClick={() => {
            printTicket(value);
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
      render: (value,item) => (<Switch onChange={()=>{UpdateStatusChange(value)}} checked={item.activo}></Switch>),
    },
  ];
  return (
    <Spin spinning={loading || printing} tip={printing ? "Imprimiendo" : ""}>
      <Row style={{ marginBottom: 24 }} gutter={[12, 12]}>
        <Col md={12} sm={24} xs={12} style={{ textAlign: "center" }}>
          <div
            style={{
              backgroundColor: "#B4C7E7",
              textAlign: "justify",
              width: "40%",
              marginLeft: "40%",
            }}
          >
            <p style={{ marginLeft: "1%" }}>
              Clave: {equip?.clave}
              <br />
              Nombre: {equip?.nombre}
              <br />
              Serie: <Link to={""}>{equip?.serie}</Link>
            </p>
          </div>
        </Col>
        <Col md={12} sm={24} xs={12} style={{ textAlign: "center" }}>
          <Form<ISearchMantain>
            form={form}
            name="equipment"
            initialValues={values}
            onFinish={onFinish}
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
                    name: "fecha",
                    label: "Fecha",
                  }}
                />
              </Col>
              <Col md={10} sm={24}>
                <TextInput
                  formProps={{
                    name: "clave",
                    label: "Nombre",
                    labelCol: { span: 10 },
                  }}
                  max={100}
                />
              </Col>
              <Col md={2} sm={24}>
                <Button
                  onClick={() => {
                    form.submit();
                  }}
                >
                  Buscar
                </Button>
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
        dataSource={[...equipments]}
        pagination={defaultPaginationProperties}
        sticky
        scroll={{ x: windowWidth < resizeWidth ? "max-content" : "auto" }}
      />
    </Spin>
  );
};

export default observer(EquipmentMantainData);
