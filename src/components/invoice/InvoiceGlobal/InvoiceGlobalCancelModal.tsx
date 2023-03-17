import { Button, Col, Form, Row } from "antd";
import { observer } from "mobx-react-lite";
import SelectInput from "../../../app/common/form/proposal/SelectInput";
import { IMotivo } from "../../../app/models/Invoice";
import { IOptions } from "../../../app/models/shared";
import { useStore } from "../../../app/stores/store";
import { formItemLayout } from "../../../app/util/utils";

type InvoiceGlobalCancelModalProps = {
  facturapiId: string;
};

const InvoiceGlobalCancelModal = ({
  facturapiId,
}: InvoiceGlobalCancelModalProps) => {
  const { invoiceCompanyStore } = useStore();
  const { cancelInvoice } = invoiceCompanyStore;
  const [formCancel] = Form.useForm();
  const onFinishCancel = async (newFormValues: any) => {
    let cancelationInvoiceData: IMotivo = {
      facturapiId: facturapiId,
      motivo: newFormValues.motivo,
    };
    await cancelInvoice(cancelationInvoiceData);
  };
  const reasonCancelation: IOptions[] = [
    {
      label: "01 Comprobantes emitidos con errores con relación.",
      value: "01",
    },
    {
      label: "02 Comprobantes emitidos con errores sin relación",
      value: "02",
    },
    {
      label: "03 No se llevó a cabo la operación.",
      value: "03",
    },
    {
      label: "04 Operación nominativa relacionada en una factura global.",
      value: "04",
    },
  ];
  return (
    <>
      <Form<any>
        {...formItemLayout}
        form={formCancel}
        name="invoiceCancel"
        onFinish={onFinishCancel}
        size="small"
      >
        <Row justify="space-between" gutter={[0, 12]}>
          <Col span={24}>
            <SelectInput
              formProps={{ label: "Selecciona motivo", name: "motivo" }}
              options={reasonCancelation}
              required
              style={{ marginBottom: 10 }}
            />
          </Col>
        </Row>
        <Row justify="end">
          <Col span={3}>
            <Button type="primary" onClick={() => formCancel.submit()}>
              Cancelar
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
};
export default observer(InvoiceGlobalCancelModal);
