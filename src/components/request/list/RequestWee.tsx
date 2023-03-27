import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Spin,
  Table,
  Typography,
} from "antd";
import { IColumns } from "../../../app/common/table/utils";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../app/stores/store";
import {
  IWeeLabFolioInfo,
  IWeePatientInfoStudy,
} from "../../../app/models/weeClinic";
import MaskInput from "../../../app/common/form/proposal/MaskInput";
import TextInput from "../../../app/common/form/proposal/TextInput";
import {
  IProceedingForm,
  IProceedingList,
} from "../../../app/models/Proceeding";
import SelectInput from "../../../app/common/form/proposal/SelectInput";
import DateInput from "../../../app/common/form/proposal/DateInput";
import alerts from "../../../app/util/alerts";
import { useNavigate } from "react-router";
import views from "../../../app/util/view";
import moment from "moment";

const { Search } = Input;
const { Link, Title } = Typography;

const RequestWee = () => {
  const {
    optionStore,
    weeClinicStore,
    procedingStore,
    modalStore,
    profileStore,
  } = useStore();
  const { profile } = profileStore;
  const { branchCityOptions, getBranchCityOptions } = optionStore;
  const { closeModal } = modalStore;
  const { searchPatientByFolio } = weeClinicStore;
  const { coincidencias, create: createRecord } = procedingStore;

  const navigate = useNavigate();

  const [form] = Form.useForm<IProceedingForm>();

  const [service, setService] = useState<IWeeLabFolioInfo>();
  const [selectedStudies, setSelectedStudies] = useState<string[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<IProceedingList>();
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

  const servicesColumns: IColumns<IWeePatientInfoStudy> = [
    {
      key: "cantidad",
      dataIndex: "cantidad",
      title: "Cantidad",
      width: "12%",
    },
    {
      key: "clave",
      dataIndex: "clave",
      title: "Clave",
      width: "18%",
    },
    {
      key: "nombre",
      dataIndex: "nombre",
      title: "Nombre",
      width: "38%",
    },
    {
      key: "descripcionWeeClinic",
      dataIndex: "descripcionWeeClinic",
      title: "WeeClinic",
      width: "32%",
    },
  ];

  useEffect(() => {
    getBranchCityOptions();
  }, [getBranchCityOptions]);

  const onSearch = async (value: string) => {
    if (value) {
      setLoading(true);
      const folio = await searchPatientByFolio(value);
      setLoading(false);
      if (folio) {
        const service = folio;
        const values: any = {
          nombre: service.nombre,
          apellido: service.paterno + " " + service.materno,
          sucursal: "00000000-0000-0000-0000-000000000000",
        };
        setLoading(true);
        const coincidences = await coincidencias(values);
        form.setFieldsValue({
          correo: folio.correo,
          telefono: folio.telefono,
          fechaNacimiento:
            folio.fechaNacimiento == null
              ? undefined
              : moment(folio.fechaNacimiento),
          sucursal: profile?.sucursal,
        });
        setSelectedStudies(folio.estudios.map((x) => x.idServicio));
        setLoading(false);
        setCoincidences(coincidences);
        setService(service);
      } else {
        setService(undefined);
        setCoincidences([]);
      }
    }
  };

  const onFinish = async (values: IProceedingForm) => {
    if (service && !selectedRecord) {
      values.nombre = service.nombre;
      values.apellido = service.paterno + " " + service.materno;
      values.sexo = service.codGenero;
      createNewRecord(values);
    } else if (service && selectedRecord) {
      createFromExistingRecord(selectedRecord);
    }
  };

  const createNewRecord = async (newRecord: IProceedingForm) => {
    if (!service) {
      alerts.warning("No se encontró el servicio");
      return;
    }
    alerts.confirm(
      "¿Desea crear la solicitud?",
      `Se creará un expediente para ${
        service!.nombreCompleto
      } y se registrará la solicitud`,
      async () => {
        const data = newRecord;
        setLoading(true);
        const recordId = await createRecord(data);
        setLoading(false);
        if (recordId) {
          navigateToRequest(recordId);
        }
      }
    );
  };

  const createFromExistingRecord = async (record: IProceedingList) => {
    if (!service) {
      alerts.warning("No se encontró el servicio");
      return;
    }
    alerts.confirm(
      "¿Desea crear la solicitud?",
      `Se registrará una solicitud para ${record.nomprePaciente}`,
      async () => {
        if (record) {
          navigateToRequest(record.id);
        }
      }
    );
  };

  const navigateToRequest = (recordId: string) => {
    navigate(`/${views.request}/${recordId}?weeFolio=${service!.folioOrden}`, {
      state: {
        services: selectedStudies,
      },
    });
    closeModal();
  };

  return (
    <Spin spinning={loading}>
      <Row justify="space-between">
        <Col>
          <Search
            addonBefore="Folio"
            placeholder="Folio de WeeClinic"
            allowClear
            onSearch={onSearch}
            style={{ width: 304 }}
          />
        </Col>
        {service && (
          <Col>
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
            <Button
              disabled={selectedStudies.length === 0}
              type="primary"
              onClick={() => form.submit()}
            >
              Crear solicitud
            </Button>
          </Col>
        )}
      </Row>
      <Divider className="header-divider" />
      <div>
        <Title style={{ marginTop: 12 }} level={5}>
          {service?.folioOrden
            ? service.folioOrden
            : "No se encontró ningun servicio"}
        </Title>
        <Form<IProceedingForm>
          style={{ display: !service ? "none" : "block" }}
          form={form}
          onFinish={onFinish}
        >
          <Row align="middle">
            <Col span={10}>
              <DescriptionItem title="TPA" content={service?.tpa} />
            </Col>
            <Col span={12}>
              <DescriptionItem
                title="Producto"
                content={service?.productoNombre}
                contentWidth="80%"
              />
            </Col>
            <Col span={10}>
              <DescriptionItem
                title="Nombre"
                content={service?.nombreCompleto}
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
                content={service?.edad}
                contentWidth="60%"
              />
            </Col>
            <Col span={4}>
              <DescriptionItem
                title="Genero"
                content={service?.codGenero}
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
                    placeholder="Correo"
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
                    placeholder="Teléfono"
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
                    placeholder="Sucursal"
                    width="100%"
                    options={branchCityOptions}
                    required
                  />
                }
                contentWidth="70%"
              />
            </Col>
          </Row>
        </Form>
      </div>
      {service && (
        <>
          <Title level={5}>Selecciona los estudios a realizar</Title>
          <Table<IWeePatientInfoStudy>
            rowKey={(record) => record.idServicio}
            columns={servicesColumns}
            dataSource={[...service.estudios]}
            pagination={false}
            sticky
            rowSelection={{
              type: "checkbox",
              selectedRowKeys: selectedStudies,
              onSelect: (_record, _selected, selectedRows) => {
                setSelectedStudies(selectedRows.map((x) => x.idServicio));
              },
              onSelectAll: (_selected, selectedRows) => {
                setSelectedStudies(selectedRows.map((x) => x.idServicio));
              },
            }}
            scroll={{ x: "auto", y: 500 }}
          />
        </>
      )}
      {coincidences.length > 0 && (
        <>
          <Row justify="space-between" align="bottom">
            <Col>
              <Title level={5} style={{ marginTop: 20 }}>
                Se encuentran coincidencias con los siguientes expedientes
              </Title>
            </Col>
            <Col>
              <Link
                style={{ marginBottom: 8, display: "inline-block" }}
                onClick={() => setSelectedRecord(undefined)}
              >
                Nuevo expediente
              </Link>
            </Col>
          </Row>
          <Table<IProceedingList>
            rowKey={(record) => record.id}
            columns={existingRecordsColumns}
            dataSource={[...coincidences]}
            pagination={false}
            sticky
            rowSelection={{
              type: "radio",
              selectedRowKeys: selectedRecord?.id ? [selectedRecord.id] : [],
              onSelect: (record) => {
                setSelectedRecord(record);
              },
            }}
            scroll={{ x: "auto", y: 500 }}
          />
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
