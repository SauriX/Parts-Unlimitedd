import { Button, Col, Form, Row } from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../../../app/stores/store";
import { observer } from "mobx-react-lite";
import DateRangeInput from "../../../../app/common/form/proposal/DateRangeInput";
import SelectInput from "../../../../app/common/form/proposal/SelectInput";
import TextInput from "../../../../app/common/form/proposal/TextInput";
import { SearchTracking } from "../../../../app/models/routeTracking";
import { formItemLayout } from "../../../../app/util/utils";
import moment from "moment";

const PendingSendFilter = () => {
  const { optionStore, routeTrackingStore, profileStore } = useStore();
  const { getAll, filterSend, setFilterSend, setTagData, setRouteStudies } =
    routeTrackingStore;
  const { branchCityOptions } = optionStore;
  const { profile, getProfile } = profileStore;

  const [form] = Form.useForm<SearchTracking>();

  let navigate = useNavigate();

  useEffect(() => {
    getProfile();
    setTagData([]);
    setRouteStudies([]);
  }, [getProfile]);

  useEffect(() => {
    if (!profile || !profile.sucursal || branchCityOptions.length === 0) return;

    const profileBranch = profile.sucursal;

    const filter = {
      ...filterSend,
      origen: profileBranch,
      fecha: [
        moment(Date.now()).utcOffset(0, true),
        moment(Date.now()).utcOffset(0, true),
      ],
    };
    form.setFieldsValue(filter);

    setFilterSend(filter);
    getAll(filter);
  }, [branchCityOptions]);

  const onFinish = async (newValues: SearchTracking) => {
    setFilterSend(newValues);
    await getAll(newValues);
  };

  return (
    <div className="status-container">
      <Form<SearchTracking>
        {...formItemLayout}
        form={form}
        name="tracking"
        initialValues={{
          fechas: [
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
                label: "Origen",
              }}
              readonly
            ></SelectInput>
          </Col>
          <Col span={6}>
            <SelectInput
              options={branchCityOptions}
              formProps={{
                name: "destino",
                label: "Destino",
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
            <Button
              style={{ backgroundColor: " #18AC50" }}
              onClick={() => {
                navigate(`/trackingOrder/new`);
              }}
              type="primary"
            >
              Crear orden de seguimiento
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};
export default observer(PendingSendFilter);
