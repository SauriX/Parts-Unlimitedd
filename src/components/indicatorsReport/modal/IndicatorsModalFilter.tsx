import { Button, Col, Form, Input, Row, Spin } from "antd";
import { observer } from "mobx-react-lite";
import moment from "moment";
import React, { useEffect, useState } from "react";
import DateRangeInput from "../../../app/common/form/proposal/DateRangeInput";
import NumberInput from "../../../app/common/form/proposal/NumberInput";
import SelectInput from "../../../app/common/form/proposal/SelectInput";
import {
  IModalIndicatorsFilter,
  IReportIndicatorsFilter,
} from "../../../app/models/indicators";
import { IOptions } from "../../../app/models/shared";
import { useStore } from "../../../app/stores/store";
import { formItemLayout } from "../../../app/util/utils";

type ModalProps = {
  modalTab: string;
};

const IndicatorsModalFilter = ({ modalTab }: ModalProps) => {
  const { optionStore, indicatorsStore } = useStore();
  const {
    branchCityOptions,
    getBranchCityOptions,
    getMedicOptions,
    getCompanyOptions,
  } = optionStore;

  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<IModalIndicatorsFilter>();

  const selectedCity = Form.useWatch("ciudad", form);
  const [cityOptions, setCityOptions] = useState<IOptions[]>([]);
  const [branchOptions, setBranchOptions] = useState<IOptions[]>([]);

  useEffect(() => {
    getBranchCityOptions();
    getMedicOptions();
    getCompanyOptions();
  }, [getBranchCityOptions, getMedicOptions, getCompanyOptions]);

  useEffect(() => {
    setCityOptions(
      branchCityOptions.map((x) => ({ value: x.value, label: x.label }))
    );
  }, [branchCityOptions]);

  useEffect(() => {
    setBranchOptions(
      branchCityOptions.find((x) => x.value === selectedCity)?.options ?? []
    );
    form.setFieldValue("sucursalId", []);
  }, [branchCityOptions, form, selectedCity]);

  const onFinish = async (filter: IModalIndicatorsFilter) => {};

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
                    formProps={{
                      name: "servicios",
                      label: "Servicio",
                    }}
                    multiple
                    options={branchOptions}
                  />
                </Col>
              ) : (
                ""
              )}
          <Col span={10}>
            <Form.Item
              label={modalTab === "service" ? "Costo Fijo" : "Costo Toma"}
              className="no-error-text"
              help=""
            >
              <Input.Group>
                <Row gutter={8}>
                  <Col span={16}>
                    <NumberInput
                      formProps={{
                        name: modalTab === "service" ? "fijo" : "toma",
                        label:
                          modalTab === "service" ? "Costo Fijo" : "Costo Toma",
                        noStyle: true,
                      }}
                      min={0}
                    />
                  </Col>
                  <Col span={8}>
                    <Button type="primary">Actualizar</Button>
                  </Col>
                </Row>
              </Input.Group>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Spin>
  );
};

export default observer(IndicatorsModalFilter);
