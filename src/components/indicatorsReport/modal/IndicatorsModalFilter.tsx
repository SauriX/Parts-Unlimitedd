import {
  Button,
  Col,
  Form,
  Input,
  message,
  Row,
  Space,
  Spin,
  Tooltip,
  Upload,
  UploadFile,
  UploadProps,
} from "antd";
import { observer } from "mobx-react-lite";
import moment from "moment";
import { Fragment, useEffect, useState } from "react";
import DateRangeInput from "../../../app/common/form/proposal/DateRangeInput";
import SelectInput from "../../../app/common/form/proposal/SelectInput";
import {
  IModalIndicatorsFilter,
  IServiceFile,
} from "../../../app/models/indicators";
import { IOptions } from "../../../app/models/shared";
import { useStore } from "../../../app/stores/store";
import {
  formItemLayout,
  objectToFormData,
  uploadFakeRequest,
} from "../../../app/util/utils";

import { PlusCircleTwoTone, WarningTwoTone } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";
import { UploadChangeParam } from "antd/lib/upload";
import alerts from "../../../app/util/alerts";

type ModalProps = {
  modalTab: string;
};

const IndicatorsModalFilter = ({ modalTab }: ModalProps) => {
  const { optionStore, indicatorsStore, modalStore } = useStore();
  const {
    branchCityOptions,
    getBranchCityOptions,
    servicesOptions,
    getServicesOptions,
  } = optionStore;
  const {
    getSamplesCostsByFilter,
    getServicesCost: getServicesCostsByFilter,
    saveFile,
    setModalFilter,
    exportServiceListExample,
  } = indicatorsStore;
  const { closeModal } = modalStore;

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<IModalIndicatorsFilter>();
  const [formFile] = Form.useForm<IServiceFile>();

  const selectedCity = Form.useWatch("ciudad", form);
  const [cityOptions, setCityOptions] = useState<IOptions[]>([]);
  const [branchOptions, setBranchOptions] = useState<IOptions[]>([]);

  useEffect(() => {
    getBranchCityOptions();
    getServicesOptions();
  }, [getBranchCityOptions, getServicesOptions]);

  useEffect(() => {
    setCityOptions(
      branchCityOptions.map((x) => ({ value: x.value, label: x.label }))
    );
  }, [branchCityOptions]);

  useEffect(() => {
    setBranchOptions(
      branchCityOptions
        .filter((x) => selectedCity?.includes(x.value as string))
        .flatMap((x) => x.options ?? [])
    );
    form.setFieldValue("sucursalId", []);
  }, [branchCityOptions, form, selectedCity]);

  const onFinish = async (filter: IModalIndicatorsFilter) => {
    setLoading(true);
    if (modalTab === "sample") {
      await getSamplesCostsByFilter(filter);
    } else if (modalTab === "service") {
      await getServicesCostsByFilter(filter);
    }

    setModalFilter(filter);
    setLoading(false);
  };

  const submitFile = async (file: FormData, fileName: string) => {
    setLoading(true);
    alerts.confirm(
      "Cargar archivo",
      `¿Está seguro que desea cargar el archivo ${fileName}?`,
      async () => {
        await saveFile(file);
        message.success(`${fileName} cargado existosamente.`);
        setLoading(false);
      },
      () => setLoading(false)
    );
  };

  const onChangeFile = (info: UploadChangeParam<UploadFile<any>>) => {
    const { status } = info.file;

    if (status === "uploading") {
      return;
    } else if (status === "done") {
      submitFile(
        objectToFormData({ archivo: info.file.originFileObj }),
        info.file.name
      );
    } else if (status === "error") {
      message.error(`Error al cargar el archivo ${info.file.name}.`);
    }
  };

  const props: UploadProps = {
    name: "file",
    multiple: false,
    showUploadList: false,
    customRequest: uploadFakeRequest,
    onChange: (info) => onChangeFile(info),
  };

  const exportServiceListExampleFile = async () => {
    setLoading(true);
    await exportServiceListExample();
    setLoading(false);
  };

  return (
    <Spin spinning={loading}>
      <Form<IModalIndicatorsFilter>
        {...formItemLayout}
        form={form}
        name="indicators"
        initialValues={{
          fecha: [
            moment(Date.now()).utcOffset(0, true),
            moment(Date.now()).utcOffset(0, true),
          ],
        }}
        onFinish={onFinish}
      >
        <Row gutter={[12, 12]}>
          <Col span={10}>
            <Form.Item label="Sucursal" className="no-error-text" help="">
              <Input.Group>
                <Row gutter={8}>
                  <Col span={12}>
                    <SelectInput
                      form={form}
                      formProps={{
                        name: "ciudad",
                        label: "Ciudad",
                        noStyle: true,
                      }}
                      options={cityOptions}
                      multiple
                    />
                  </Col>
                  <Col span={12}>
                    <SelectInput
                      form={form}
                      formProps={{
                        name: "sucursalId",
                        label: "Sucursales",
                        noStyle: true,
                      }}
                      multiple
                      options={branchOptions}
                    />
                  </Col>
                </Row>
              </Input.Group>
            </Form.Item>
          </Col>
          <Col span={10}>
            <DateRangeInput
              formProps={{ label: "Fecha", name: "fecha" }}
              pickerType="month"
              required={true}
              disableAfterDates
            />
          </Col>
          <Col span={4} style={{ textAlign: "right" }}>
            <Button key="new" type="primary" htmlType="submit">
              Filtrar
            </Button>
          </Col>
          {modalTab === "service" ? (
            <Fragment>
              <Col span={10}>
                <SelectInput
                  form={form}
                  formProps={{
                    name: "servicios",
                    label: "Servicio",
                  }}
                  multiple
                  options={servicesOptions}
                />
              </Col>
              <Col span={2}>
                <PlusCircleTwoTone
                  onClick={() => {
                    navigate(`/catalogs?catalog=costofijo`);
                    closeModal();
                  }}
                />
              </Col>
              <Col span={12}>
                <Space size="middle">
                  <Upload {...props}>
                    <Button type="primary" icon={<UploadOutlined />}>
                      Cargar excel
                    </Button>
                  </Upload>
                  <Tooltip
                    title="Ejemplo de como cargar excel de Costos Fijos"
                    color="orange"
                    placement="right"
                  >
                    <WarningTwoTone
                      onClick={() => exportServiceListExampleFile()}
                      twoToneColor="#ee9f27"
                    />
                  </Tooltip>
                </Space>
              </Col>
            </Fragment>
          ) : (
            ""
          )}
        </Row>
      </Form>
    </Spin>
  );
};

export default observer(IndicatorsModalFilter);
