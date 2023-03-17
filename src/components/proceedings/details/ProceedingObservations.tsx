import { Button, Col, Divider, Form, Row } from "antd";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import TextAreaInput from "../../../app/common/form/proposal/TextAreaInput";
import {
  IProceedingForm,
  ProceedingFormValues,
} from "../../../app/models/Proceeding";
import { useStore } from "../../../app/stores/store";
import { formItemLayout } from "../../../app/util/utils";
type ProceedingObservationsProps = {
  observaciones?: string;
  proceedingId: string;
};
const ProceedingObservations = ({
  observaciones,
  proceedingId,
}: ProceedingObservationsProps) => {
  const [form] = Form.useForm();
  const { procedingStore } = useStore();
  const { updateObservation, getById } = procedingStore;
  const [expediente, setExpediente] = useState<IProceedingForm>(
    new ProceedingFormValues()
  );

  useEffect(() => {
    const obtenerExpedfiente = async () => {
      if (proceedingId) {
        const expediente = await getById(proceedingId);

        setExpediente(expediente!);
      }
    };
    obtenerExpedfiente();
  }, [proceedingId]);

  useEffect(() => {
    form.setFieldValue("observaciones", expediente.observaciones);
  }, [expediente]);

  const onFinish = (newFormValues: any) => {
    const proceedingUpdate = new ProceedingFormValues();
    if (proceedingId) {
      proceedingUpdate.id = proceedingId;
    }
    proceedingUpdate.observaciones = newFormValues.observaciones;

    updateObservation({
      id: proceedingId,
      observations: newFormValues.observaciones,
    });
  };

  return (
    <>
      <Divider orientation="left">Observaciones</Divider>
      <Form<any>
        form={form}
        {...formItemLayout}
        onFinish={onFinish}
        initialValues={{ observaciones: observaciones }}
      >
        <Row
          style={{
            paddingBottom: 10,
            marginBottom: 10,
          }}
        >
          <Col span={24}>
            <TextAreaInput
              formProps={{
                name: "observaciones",
                label: "",
              }}
              rows={3}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <Button
              type="primary"
              onClick={() => {
                form.submit();
              }}
            >
              Guardar
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default observer(ProceedingObservations);
