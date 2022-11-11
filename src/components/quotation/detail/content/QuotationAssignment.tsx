import { Spin, Form, Row, Col, Button, Table } from "antd";
import { FC, useEffect, useState } from "react";
import { formItemLayout } from "../../../../app/util/utils";
import TextInput from "../../../../app/common/form/proposal/TextInput";
import { useStore } from "../../../../app/stores/store";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import views from "../../../../app/util/view";
import {
  defaultPaginationProperties,
  getDefaultColumnProps,
  IColumns,
  ISearch,
} from "../../../../app/common/table/utils";
import { IFormError } from "../../../../app/models/shared";
import {
  IQuotationExpedienteSearch,
  QuotationExpedienteSearchValues,
} from "../../../../app/models/quotation";
import { IProceedingList } from "../../../../app/models/Proceeding";
import IconButton from "../../../../app/common/button/IconButton";
import useWindowDimensions from "../../../../app/util/window";
import { EditOutlined } from "@ant-design/icons";
import DateRangeInput from "../../../../app/common/form/proposal/DateRangeInput";

type GeneralesFormProps = {
  // printing: boolean;
  // handleIdExpediente: React.Dispatch<
  //   React.SetStateAction<IProceedingList | undefined>
  // >;
  // handleCotizacion: React.Dispatch<React.SetStateAction<IQuotationForm>>;
};

const QuotationAssignment: FC<GeneralesFormProps> = (
  {
    // printing,
    // handleIdExpediente,
    // handleCotizacion,
  }
) => {
  const { quotationStore } = useStore();
  const { getExpediente, records } = quotationStore;
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<IQuotationExpedienteSearch>();
  const [values, setValues] = useState<IQuotationExpedienteSearch>(
    new QuotationExpedienteSearchValues()
  );
  const [errors, setErrors] = useState<IFormError[]>([]);
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

  const onFinish = async (newValues: IQuotationExpedienteSearch) => {
    setLoading(true);

    const reagent = { ...values, ...newValues };
    await getExpediente(reagent);
    setLoading(false);
  };
  const onValuesChange = async (changedValues: IQuotationExpedienteSearch) => {
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
            // handleIdExpediente(expediente);
            console.log("here");
            console.log(expediente);
            // handleCotizacion((prev) => ({
            //   ...prev,
            //   expedienteid: expediente.id,
            //   expediente: expediente.expediente,
            //   nomprePaciente: expediente.nomprePaciente,
            //   edad: expediente.edad,
            //   fechaNacimiento: moment(expediente.fechaNacimiento, "DD-MM-YYYY"),
            //   genero: expediente.genero,
            // }));
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
        width: 200,
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
            navigate(`/${views.proceeding}/${expediente.id}?mode=edit`);
          }}
        />
      ),
      fixed: "right",
    },
  ];

  return (
    <Spin spinning={loading}>
      <Form<IQuotationExpedienteSearch>
        {...formItemLayout}
        form={form}
        name="generales"
        initialValues={values}
        onFinish={onFinish}
        scrollToFirstError
        onValuesChange={onValuesChange}
        onFinishFailed={({ errorFields }) => {
          const errors = errorFields.map((x) => ({
            name: x.name[0].toString(),
            errors: x.errors,
          }));
          setErrors(errors);
        }}
      >
        <Row justify="space-between" style={{ marginBottom: "15px" }}>
          <Col span={8}>
            <TextInput
              formProps={{
                name: "buscar",
                label: "Buscar",
              }}
              showLabel
              max={100}
              //errors={errors.find((x) => x.name === "exp")?.errors}
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
              max={100}
              type="email"
              //errors={errors.find((x) => x.name === "exp")?.errors}
            />
          </Col>
          <Col span={8}>
            <TextInput
              formProps={{
                name: "telfono",
                label: "Teléfono",
              }}
              max={10}
              errors={errors.find((x) => x.name === "telfono")?.errors}
            />
          </Col>
          <Col span={2}></Col>
        </Row>
      </Form>
      <br />
      <Table<IProceedingList>
        loading={loading}
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
export default observer(QuotationAssignment);
