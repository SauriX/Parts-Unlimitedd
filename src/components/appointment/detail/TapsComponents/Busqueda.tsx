import {
  Spin,
  Form,
  Row,
  Col,
  Pagination,
  Button,
  PageHeader,
  Divider,
  Radio,
  DatePicker,
  List,
  Typography,
  Select,
  Table,
  Checkbox,
  Input,
  Tag,
  InputNumber,
  Tabs,
  Descriptions,
} from "antd";
import React, { FC, useEffect, useState } from "react";
import { formItemLayout } from "../../../../app/util/utils";
import TextInput from "../../../../app/common/form/proposal/TextInput";
import { useStore } from "../../../../app/stores/store";
import {
  IReagentForm,
  ReagentFormValues,
} from "../../../../app/models/reagent";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import ImageButton from "../../../../app/common/button/ImageButton";
import HeaderTitle from "../../../../app/common/header/HeaderTitle";
import { observer } from "mobx-react-lite";
import views from "../../../../app/util/view";
import NumberInput from "../../../../app/common/form/NumberInput";
import SelectInput from "../../../../app/common/form/SelectInput";
import SwitchInput from "../../../../app/common/form/SwitchInput";
import alerts from "../../../../app/util/alerts";
import messages from "../../../../app/util/messages";
import {
  defaultPaginationProperties,
  getDefaultColumnProps,
  IColumns,
  ISearch,
} from "../../../../app/common/table/utils";
import { IOptions } from "../../../../app/models/shared";
import moment from "moment";
import type { CheckboxValueType } from "antd/es/checkbox/Group";
import TextArea from "antd/lib/input/TextArea";
import { moneyFormatter } from "../../../../app/util/utils";
import { IProceedingList } from "../../../../app/models/Proceeding";
import IconButton from "../../../../app/common/button/IconButton";
import useWindowDimensions, { resizeWidth } from "../../../../app/util/window";
import { EditOutlined } from "@ant-design/icons";
import DateInput from "../../../../app/common/form/proposal/DateInput";
import DateRangeInput from "../../../../app/common/form/DateRangeInput";
import {
  AppointmentExpedienteSearchValues,
  IAppointmentExpedienteSearch,
  IAppointmentForm,
} from "../../../../app/models/appointmen";
type GeneralesFormProps = {
  printing: boolean;
  handleIdExpediente: React.Dispatch<
    React.SetStateAction<IProceedingList | undefined>
  >;
  handleCotizacion: React.Dispatch<React.SetStateAction<IAppointmentForm>>;
};

const BusquedaForm: FC<GeneralesFormProps> = ({
  printing,
  handleIdExpediente,
  handleCotizacion,
}) => {
  const { quotationStore } = useStore();
  const { getExpediente, records } = quotationStore;
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<IAppointmentExpedienteSearch>();
  const [values, setValues] = useState<IAppointmentExpedienteSearch>(
    new AppointmentExpedienteSearchValues()
  );
  let navigate = useNavigate();
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });
  useEffect(() => {
    const readexp = async () => {
      await getExpediente(values);
    };
    readexp();
  }, [getExpediente]);
  const { width: windowWidth } = useWindowDimensions();

  const onFinish = async (newValues: IAppointmentExpedienteSearch) => {
    setLoading(true);

    const reagent = { ...values, ...newValues };
    // await getExpediente(reagent);
    setLoading(false);
  };
  const onValuesChange = async (
    changedValues: IAppointmentExpedienteSearch
  ) => {
    const field = Object.keys(changedValues)[0];
    if (field == "edad") {
      /*  const edad = changedValues[field] as number; */
      var hoy = new Date();
      /*     var cumpleaños =  hoy.getFullYear()-edad; */
      /* hoy.setFullYear(cumpleaños); */
      /* setValues((prev) => ({ ...prev, fechaNacimiento: hoy })) */
    }
    if (field === "cp") {
      /* const zipCode = changedValues[field] as string */
      /*         if (zipCode && zipCode.trim().length === 5) {
            } */
    }
  };
  const columns: IColumns<IProceedingList> = [
    {
      ...getDefaultColumnProps("expediente", "Expediente", {
        searchState,
        setSearchState,
        width: 100,
      }),
      render: (value, expediente) => (
        <Button
          type="link"
          onClick={() => {
            handleIdExpediente(expediente);
            console.log("here");
            console.log(expediente);
            handleCotizacion((prev) => ({
              ...prev,
              expedienteid: expediente.id,
              expediente: expediente.expediente,
              nomprePaciente: expediente.nomprePaciente,
              edad: expediente.edad,
              fechaNacimiento: moment(expediente.fechaNacimiento, "DD-MM-YYYY"  ),
              genero: expediente.genero,
            }));
          }}
        >
          {value}
        </Button>
      ),
      fixed: "left",
    },
    {
      ...getDefaultColumnProps("nomprePaciente", "Nombre del paciente", {
        searchState,
        setSearchState,
        width: 200,
      }),
    },
    {
      ...getDefaultColumnProps("genero", "Genero", {
        searchState,
        setSearchState,
        width: 100,
      }),
    },
    {
      ...getDefaultColumnProps("edad", "Edad", {
        searchState,
        setSearchState,
        width: 100,
      }),
    },
    {
      ...getDefaultColumnProps("fechaNacimiento", "Fecha de nacimiento", {
        searchState,
        setSearchState,
        width: 200,
      }),
    },
    {
      ...getDefaultColumnProps("monederoElectronico", "Monedero electrónico", {
        searchState,
        setSearchState,
        width: 100,
      }),
    },
    {
      ...getDefaultColumnProps("telefono", "Teléfono", {
        searchState,
        setSearchState,
        width: 100,
      }),
    },
    {
      key: "editar",
      dataIndex: "id",
      title: "Editar",
      align: "center",
      width: 100,
      render: (value, expediente) => (
        <IconButton
          title="Editar Expediente"
          icon={<EditOutlined />}
          onClick={() => {
            navigate(`/${views.proceeding}/${value}?&mode=edit`);
          }}
        />
      ),
      fixed: "right",
    },
  ];

  return (
    <Spin spinning={loading || printing} tip={printing ? "Imprimiendo" : ""}>
      <Form<IAppointmentExpedienteSearch>
        {...formItemLayout}
        form={form}
        name="generales"
        initialValues={values}
        onFinish={onFinish}
        scrollToFirstError
        onValuesChange={onValuesChange}
      >
        <Row justify="space-between">
          <Col span={8}>
            <TextInput
              formProps={{
                name: "buscar",
                label: "Buscar",
              }}
              showLabel
              max={100}
            />
          </Col>

          <Col span={8}>
            <DateRangeInput
              formProps={{
                label: "Fecha",
                name: "fecha",
              }}
            />
          </Col>
          <Col span={2}>
            <Button
              type="primary"
              htmlType="submit"
              onClick={() => {
                form.submit();
              }}
            >
              Buscar
            </Button>
          </Col>
        </Row>
        <Row justify="space-between">
          <Col span={8}>
            <TextInput
              formProps={{
                name: "email",
                label: "Email",
              }}
              max={300}
              //errors={errors.find((x) => x.name === "exp")?.errors}
            />
          </Col>
          <Col span={8}>
            <TextInput
              formProps={{
                name: "telefono",
                label: "Teléfono",
              }}
              max={100}
              //errors={errors.find((x) => x.name === "exp")?.errors}
            />
          </Col>
          <Col span={2}></Col>
        </Row>
      </Form>
      <br />
      <Table<IProceedingList>
        loading={loading || printing}
        size="small"
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={records}
        pagination={defaultPaginationProperties}
        sticky
        scroll={{ x: "max-content" }}
      />
    </Spin>
  );
};
export default observer(BusquedaForm);
