import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Typography,
} from "antd";
import {
  getDefaultColumnProps,
  IColumns,
} from "../../../app/common/table/utils";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../app/stores/store";
import { IWeeLabBusquedaFolios } from "../../../app/models/weeClinic";
import MaskInput from "../../../app/common/form/proposal/MaskInput";
import TextInput from "../../../app/common/form/proposal/TextInput";
import {
  IProceedingForm,
  IProceedingList,
} from "../../../app/models/Proceeding";
import SelectInput from "../../../app/common/form/proposal/SelectInput";
import DateInput from "../../../app/common/form/proposal/DateInput";
import { toJS } from "mobx";
import alerts from "../../../app/util/alerts";
import { useNavigate } from "react-router";
import views from "../../../app/util/view";

const { Search } = Input;
const { Paragraph, Title } = Typography;

const RequestWee = () => {
  const { optionStore, weeClinicStore, procedingStore, modalStore } =
    useStore();
  const { branchCityOptions, getBranchCityOptions } = optionStore;
  const { closeModal } = modalStore;
  const { Laboratorio_BusquedaFolios } = weeClinicStore;
  const { coincidencias, create: createRecord } = procedingStore;

  const navigate = useNavigate();

  const [form] = Form.useForm<IProceedingForm>();

  const [record, setRecord] = useState<IProceedingForm>();
  const [service, setService] = useState<IWeeLabBusquedaFolios>();
  const [coincidences, setCoincidences] = useState<IProceedingList[]>([]);
  const [loading, setLoading] = useState(false);

  const existingRecordsColumns: IColumns<IProceedingList> = [
    {
      key: "expediente",
      dataIndex: "expediente",
      title: "Expediente",
      width: "20%",
    },
    {
      key: "nomprePaciente",
      dataIndex: "nomprePaciente",
      title: "Paciente",
      width: "35%",
    },
    {
      key: "telefono",
      dataIndex: "telefono",
      title: "Teléfono",
      width: "15%",
    },
    {
      key: "fechaNacimiento",
      dataIndex: "fechaNacimiento",
      title: "Fecha de nacimiento",
      width: "20%",
    },
    {
      key: "genero",
      dataIndex: "genero",
      title: "Genero",
      width: "10%",
    },
  ];

  useEffect(() => {
    getBranchCityOptions();
  }, [getBranchCityOptions]);

  const onSearch = async (value: string) => {
    if (value) {
      setLoading(true);
      const folios = await Laboratorio_BusquedaFolios(value);
      setLoading(false);
      console.log(folios);
      if (folios && folios.length > 0) {
        setService(folios[0]);
      } else {
        setService(undefined);
      }
    }
  };

  const onFinish = async (values: IProceedingForm) => {
    if (service) {
      setLoading(true);
      values.nombre = service.nombre;
      values.apellido = service.paterno + " " + service.materno;
      values.sexo = service.codGenero;
      const coincidences = await coincidencias(values);
      setCoincidences(coincidences);
      setRecord(values);
      setLoading(false);

      if (coincidences.length === 0) {
        createNewRecord(values);
      }
    }
  };

  const createNewRecord = async (newRecord?: IProceedingForm) => {
    alerts.confirm(
      "¿Desea crear la solicitud?",
      `Se creará un expediente para ${
        service!.nombreCompleto
      } y se registrará la solicitud`,
      async () => {
        const data = newRecord ?? (toJS(record) as IProceedingForm);
        setLoading(true);
        const recordId = await createRecord(data);
        setLoading(false);
        if (recordId) {
          navigate(`/${views.request}/${recordId}`);
          closeModal();
        }
      }
    );
  };

  const createFromExistingRecord = async (record: IProceedingList) => {
    alerts.confirm(
      "¿Desea crear la solicitud?",
      `Se registrará una solicitud para ${record.nomprePaciente}`,
      async () => {
        if (record) {
          navigate(`/${views.request}/${record.id}`);
          closeModal();
        }
      }
    );
  };

  return (
    <Spin spinning={loading}>
      <Search
        addonBefore="Folio"
        placeholder="Folio de WeeClinic"
        allowClear
        onSearch={onSearch}
        style={{ width: 304 }}
      />
      <Divider className="header-divider" />
      <div>
        <Title style={{ marginTop: 12 }} level={5}>
          {service?.folioOrden
            ? service.folioOrden
            : "No se encontró ningun servicio"}
        </Title>
        {service && (
          <Form<IProceedingForm> form={form} onFinish={onFinish}>
            <Row align="middle">
              <Col span={10}>
                <DescriptionItem title="TPA" content={service.tpa} />
              </Col>
              <Col span={12}>
                <DescriptionItem
                  title="Producto"
                  content={service.productoNombre}
                  contentWidth="80%"
                />
              </Col>
              <Col span={10}>
                <DescriptionItem
                  title="Nombre"
                  content={service.nombreCompleto}
                />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  title="Nacimiento"
                  content={
                    <DateInput
                      formProps={{
                        name: "fechaNacimiento",
                      }}
                      width="90%"
                      required
                    />
                  }
                  contentWidth="60%"
                />
              </Col>
              <Col span={4}>
                <DescriptionItem
                  title="Edad"
                  content={service.edad}
                  contentWidth="60%"
                />
              </Col>
              <Col span={4}>
                <DescriptionItem
                  title="Genero"
                  content={service.codGenero}
                  contentWidth="50%"
                />
              </Col>
              <Col span={10}>
                <DescriptionItem
                  title="Correo"
                  content={
                    <TextInput
                      formProps={{
                        name: "correo",
                      }}
                      type="email"
                      width="85%"
                      max={500}
                    />
                  }
                />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  title="Teléfono"
                  content={
                    <MaskInput
                      formProps={{
                        name: "telefono",
                      }}
                      width="90%"
                      mask={[
                        /[0-9]/,
                        /[0-9]/,
                        /[0-9]/,
                        "-",
                        /[0-9]/,
                        /[0-9]/,
                        /[0-9]/,
                        "-",
                        /[0-9]/,
                        /[0-9]/,
                        "-",
                        /[0-9]/,
                        /[0-9]/,
                      ]}
                      validator={(_, value: any) => {
                        if (!value || value.indexOf("_") === -1) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          "El campo debe contener 10 dígitos"
                        );
                      }}
                    />
                  }
                  contentWidth="60%"
                />
              </Col>
              <Col span={8}>
                <DescriptionItem
                  title="Sucursal"
                  content={
                    <SelectInput
                      formProps={{
                        name: "sucursal",
                      }}
                      width="100%"
                      options={branchCityOptions}
                      required
                    />
                  }
                  contentWidth="70%"
                />
              </Col>
              <Col span={24} style={{ textAlign: "right" }}>
                <Button
                  danger
                  type="default"
                  onClick={() => {
                    form.resetFields();
                    setService(undefined);
                    setCoincidences([]);
                  }}
                >
                  Cancelar
                </Button>
                {coincidences.length === 0 && (
                  <Button type="primary" onClick={() => form.submit()}>
                    Aceptar
                  </Button>
                )}
              </Col>
            </Row>
          </Form>
        )}
      </div>
      {coincidences.length > 0 && (
        <>
          <Divider className="header-divider" />
          <Title level={5}>
            Se encuentran coincidencias con los siguientes expedientes
          </Title>
          <Table<IProceedingList>
            rowKey={(record) => record.id}
            columns={existingRecordsColumns}
            dataSource={[...coincidences]}
            pagination={false}
            sticky
            rowSelection={{
              type: "radio",
              onSelect: (record) => {
                createFromExistingRecord(record);
              },
            }}
            scroll={{ x: "auto", y: 500 }}
          />
          <Row style={{ marginTop: 12 }}>
            <Col span={24} style={{ textAlign: "right" }}>
              <Button type="primary" onClick={() => createNewRecord()}>
                Continuar con expediente nuevo
              </Button>
            </Col>
          </Row>
        </>
      )}
    </Spin>
  );
};

export default observer(RequestWee);

interface DescriptionItemProps {
  title: string;
  content: React.ReactNode;
  contentWidth?: string;
}

const DescriptionItem = ({
  title,
  content,
  contentWidth,
}: DescriptionItemProps) => (
  <div className="site-description-item-profile-wrapper">
    <p
      className="site-description-item-profile-p-label"
      style={{
        width: contentWidth
          ? (100 - Number(contentWidth.slice(0, -1))).toString() + "%"
          : "20%",
      }}
    >
      {title}:
    </p>
    <div
      className="site-description-item-profile-p-label"
      style={{ width: contentWidth ?? "80%" }}
    >
      {content}
    </div>
  </div>
);
