import { Button, Col, Form, Row } from "antd";
import form from "antd/lib/form";
import { observer } from "mobx-react-lite";
import moment from "moment";
import React, { Fragment, useEffect, useState } from "react";
import { ISearchTracking } from "../../../../app/models/routeTracking";
import { formItemLayout } from "../../../../app/util/utils";
import DateRangeInput from "../../../../app/common/form/proposal/DateRangeInput";
import TextInput from "../../../../app/common/form/proposal/TextInput";
import SelectInput from "../../../../app/common/form/proposal/SelectInput";
import { useStore } from "../../../../app/stores/store";

const PendingReceiveFilter = () => {
  const { optionStore, routeTrackingStore, profileStore } = useStore();
  const { branchCityOptions, getBranchCityOptions } = optionStore;
  const { getAllPendingReceive, routeTrackingFilter, setRouteTrackingFilter } =
    routeTrackingStore;
  const { profile } = profileStore;

  const [form] = Form.useForm<ISearchTracking>();

  useEffect(() => {
    if (!profile || !profile.sucursal || branchCityOptions.length === 0) return;

    const profileBranch = profile.sucursal;

    const filter = {
      ...routeTrackingFilter,
      destino: routeTrackingFilter.destino,
      origen: routeTrackingFilter.origen || profileBranch,
    };
    form.setFieldsValue(filter);

    setRouteTrackingFilter(filter);
    getAllPendingReceive(filter);
  }, [branchCityOptions]);

  const onFinish = async (newValues: ISearchTracking) => {
    setRouteTrackingFilter(newValues);
    await getAllPendingReceive(newValues);
  };

  return (
    <div className="status-container">
      <Form<ISearchTracking>
        {...formItemLayout}
        form={form}
        name="tracking"
        initialValues={{
          fecha: [
            moment(Date.now()).utcOffset(0, true),
            moment(Date.now()).utcOffset(0, true),
          ],
        }}
        onFinish={onFinish}
        scrollToFirstError
      >
        <Row gutter={[0, 12]}>
          <Col span={6}>
            <SelectInput
              options={branchCityOptions}
              formProps={{
                name: "origen",
                label: "Destino",
              }}
            ></SelectInput>
          </Col>
          <Col span={6}>
            <SelectInput
              options={branchCityOptions}
              formProps={{
                name: "destino",
                label: "Origen",
              }}
            ></SelectInput>
          </Col>
          <Col span={6}>
            <DateRangeInput
              formProps={{ name: "fecha", label: "Fecha" }}
              disableAfterDates
            ></DateRangeInput>
          </Col>
          <Col span={6}>
            <TextInput
              formProps={{
                name: "buscar",
                label: "Buscar",
              }}
              autoFocus
            ></TextInput>
          </Col>
          <Col span={24} style={{ textAlign: "right" }}>
            <Button htmlType="submit" type="primary">
              Buscar
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default observer(PendingReceiveFilter);
