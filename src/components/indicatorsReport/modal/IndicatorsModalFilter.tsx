import { Button, Col, Form, Input, Row, Spin } from "antd";
import { observer } from "mobx-react-lite";
import moment from "moment";
import { useEffect, useState } from "react";
import DateRangeInput from "../../../app/common/form/proposal/DateRangeInput";
import NumberInput from "../../../app/common/form/proposal/NumberInput";
import SelectInput from "../../../app/common/form/proposal/SelectInput";
import { IModalIndicatorsFilter } from "../../../app/models/indicators";
import { IOptions } from "../../../app/models/shared";
import { useStore } from "../../../app/stores/store";
import { formItemLayout } from "../../../app/util/utils";

import { PlusCircleTwoTone } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

type ModalProps = {
  modalTab: string;
};

const IndicatorsModalFilter = ({ modalTab }: ModalProps) => {
  const { optionStore, indicatorsStore } = useStore();
  const {
    branchCityOptions,
    getBranchCityOptions,
    servicesOptions,
    getServicesOptions
  } = optionStore;
  const { getSamplesCostsByFilter, getServicesCost: getServicesCostsByFilter } = indicatorsStore;

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<IModalIndicatorsFilter>();

  const selectedCity = Form.useWatch("ciudad", form);
  const [cityOptions, setCityOptions] = useState<IOptions[]>([]);
  const [branchOptions, setBranchOptions] = useState<IOptions[]>([]);
  const [serviceOptions, setServiceOptions] = useState<IOptions[]>([]);

  useEffect(() => {
    getBranchCityOptions();
    getServicesOptions();
  }, [getBranchCityOptions, servicesOptions]);

  useEffect(() => {
    setCityOptions(
      branchCityOptions.map((x) => ({ value: x.value, label: x.label }))
    );
  }, [branchCityOptions]);

  useEffect(() => {
    setServiceOptions(
      serviceOptions.map((x) => ({ value: x.value, label: x.label }))
    );
  }, [serviceOptions]);

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
                      formProps={{
                        name: "ciudad",
                        label: "Ciudad",
                        noStyle: true,
                      }}
                      options={cityOptions}
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
            <Col span={10}>
              <SelectInput
                form={form}
                formProps={{
                  name: "servicios",
                  label: "Servicio",
                }}
                multiple
                options={serviceOptions}
              />
              <PlusCircleTwoTone
                onClick={() => {
                  navigate(`/catalogs?catalog=costofijo`);
                }}
              />
            </Col>
          ) : (
            ""
          )}
        </Row>
      </Form>
    </Spin>
  );
};

export default observer(IndicatorsModalFilter);
