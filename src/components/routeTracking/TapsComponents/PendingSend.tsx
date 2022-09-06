import {
  Button,
  Checkbox,
  Col,
  Descriptions,
  Form,
  Input,
  PageHeader,
  Row,
  Table,
  Tag,
} from "antd";
import { FC, Fragment, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useStore } from "../../../app/stores/store";
import { PlusOutlined } from "@ant-design/icons";
import { observer } from "mobx-react-lite";
import DateRangeInput from "../../../app/common/form/proposal/DateRangeInput";
import SelectInput from "../../../app/common/form/proposal/SelectInput";
import TextInput from "../../../app/common/form/proposal/TextInput";
import {
  IsamplingForm,
  IsamplingList,
  samplingFormValues,
} from "../../../app/models/sampling";
import {
  getDefaultColumnProps,
  IColumns,
  ISearch,
} from "../../../app/common/table/utils";
import { ExpandableConfig } from "antd/lib/table/interface";
import ImageButton from "../../../app/common/button/ImageButton";
import { getExpandableConfig } from "../../report/utils";
const PendingSend = () => {
  const { procedingStore, optionStore, locationStore, samplig } = useStore();
  const { getAll, studys, printTicket, update } = samplig;
  const [values, setValues] = useState<IsamplingForm>(new samplingFormValues());
  useEffect(() => {
    const readPriceList = async () => {
      let studios = [];
      var datas = await getAll(values!);
      console.log(datas, "daata");
      //setSoliCont(datas?.length!);
      datas?.forEach((x: any) => studios.push(x.studys));
      //setStudyCont(studios.length);
      //setLoading(false);
    };

    if (studys.length === 0) {
      readPriceList();
    }
    console.log(getExpandableConfig("estudios"), "config");
    setExpandable(expandableStudyConfig);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getAll]);
  const navigate = useNavigate();
  const expandableStudyConfig = {
  
    expandedRowRender: (item: IsamplingList) => (
      <div>
        <h4>Estudios</h4>
        {item.estudios.map((x) => {
          return (
            <>
              <Descriptions
                size="small"
                bordered
                labelStyle={{ fontWeight: "bold" }}
                contentStyle={{ background: "#fff" }}
                style={{ marginBottom: 5 }}
              >
                <Descriptions.Item label="Clave" style={{ maxWidth: 30 }}>
                  {x.clave}
                </Descriptions.Item>
                <Descriptions.Item label="Estudio" style={{ maxWidth: 30 }}>
                  {x.nombre}
                </Descriptions.Item>
                <Descriptions.Item label="Estatus" style={{ maxWidth: 30 }}>
                  {x.status == 1 ? "Pendiente" : "Toma de muestra"}
                </Descriptions.Item>
                <Descriptions.Item label="Registro" style={{ maxWidth: 30 }}>
                  {x.registro}
                </Descriptions.Item>
                <Descriptions.Item label="Entrega" style={{ maxWidth: 30 }}>
                  {x.entrega}
                </Descriptions.Item>
                <Descriptions.Item label="" style={{ maxWidth: 30 }}>
                  {x.status == 1 && (
                    <Checkbox
                      onChange={(e) => /*  onChange(e, x.id, item.id) */ {}}
                    >
                      Selecciona
                    </Checkbox>
                  )}
                  {x.status == 2 && (
                    <Checkbox
                      onChange={(e) => /*  onChange(e, x.id, item.id) */ {}}
                    >
                      Selecciona
                    </Checkbox>
                  )}
                  <ImageButton
                    title="Imprimir"
                    image="print"
                    onClick={() => {
                      //printTicket(item.order, item.id);
                    }}
                  ></ImageButton>
                </Descriptions.Item>
              </Descriptions>
            </>
          );
        })}
      </div>
    ),
    rowExpandable: () => true,
  };
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });
  const hasFooterRow = true;
  const [expandable, setExpandable] =
    useState<ExpandableConfig<IsamplingList>>();

  const columns: IColumns<IsamplingList> = [
    {
      ...getDefaultColumnProps("solicitud", "# DE SEGUMIENTO", {
        searchState,
        setSearchState,
        width: "20%",
      }),
    },
    {
      ...getDefaultColumnProps("nombre", "CLAVE DE RUTA", {
        searchState,
        setSearchState,
        width: "15%",
      }),
    },
    {
      ...getDefaultColumnProps("registro", "SUCURSAL", {
        searchState,
        setSearchState,
        width: "20%",
      }),
    },
    {
      ...getDefaultColumnProps("sucursal", "FECHA DE ENTREGA", {
        searchState,
        setSearchState,
        width: "15%",
      }),
    },
    {
      ...getDefaultColumnProps("edad", "Estatus", {
        searchState,
        setSearchState,
        width: "15%",
      }),
    },
    {
      ...getDefaultColumnProps("sexo", "EDITAR", {
        searchState,
        setSearchState,
        width: "15%",
      }),
    },

    {
      ...getDefaultColumnProps("compañia", "Impresión", {
        searchState,
        setSearchState,
        width: "20%",
      }),
    },
  ];
  return (
    <Fragment>
      <Button
        style={{ marginLeft: "45%", marginBottom: "5%" }}
        type="primary"
        danger
        onClick={() => {
          navigate("/trackingOrder");
        }}
      >
        Crear orden de seguimiento
      </Button>
      <Form<any>>
        <Row gutter={[0, 12]}>
          <Col span={8}>
            <DateRangeInput
              formProps={{ name: "fecha", label: "Fecha" }}
            ></DateRangeInput>
          </Col>
          <Col span={2}></Col>
          <Col span={4}>
            <SelectInput
              options={[]}
              formProps={{ name: "sucursal", label: "Sucursal" }}
              style={{ marginLeft: "10px" }}
            ></SelectInput>
          </Col>
          <Col span={2}></Col>
          <Col span={4}>
            <TextInput
              formProps={{
                name: "buscar",
                label: "Buscar",
                labelCol: { span: 5 },
              }}
            ></TextInput>
          </Col>
          <Col span={4}>
            <Button style={{ marginLeft: "5%" }} type="primary">
              Buscar
            </Button>
          </Col>
        </Row>
      </Form>
      <Row style={{ marginLeft: "20%", marginBottom: "2%" }}>
        <Col span={8}>
          <Button style={{ marginTop: "8%", marginLeft: "2%" }} type="primary">
            Enviar ruta
          </Button>
          <Button style={{ marginTop: "8%", marginLeft: "2%" }} type="primary">
            Cancelar envió
          </Button>
        </Col>
        <Col span={8}></Col>
        <Col span={8}>
          <Button style={{ marginTop: "8%", marginLeft: "2%" }} type="primary">
            Enviar
          </Button>
          <Button style={{ marginTop: "8%", marginLeft: "2%" }} type="primary">
            Cancelar
          </Button>
        </Col>
      </Row>
      <Fragment>
        <Table<IsamplingList>
          loading={false}
          size="small"
          rowKey={(record) => record.solicitud}
          columns={columns}
          pagination={false}
          dataSource={[...studys]}
          scroll={{ y: 500 }}
          //(rowClassName={(item) => (item.claveMedico == "Total" || item.paciente === "Total" ? "Resumen Total" : "")}
          expandable={expandable}
        />
        <div style={{ textAlign: "right", marginTop: 10 }}>
          <Tag color="lime">
            {!hasFooterRow ? 3 : Math.max(3 - 1, 0)} Registros
          </Tag>
        </div>
      </Fragment>
    </Fragment>
  );
};
export default observer(PendingSend);
