import { Descriptions, Select, Row, Col, Input, Button } from "antd";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../app/stores/store";
import { moneyFormatter } from "../../../app/util/utils";

const RequestInvoice = () => {
  const { requestStore } = useStore();
  const { totals } = requestStore;

  return (
    <Row gutter={[8, 12]} align="bottom">
      <Col span={5}>
        <div style={{ height: 24 }}>
          <label>Serie</label>
        </div>
        <Select
          showSearch
          placeholder={"Serie"}
          optionFilterProp="children"
          filterOption={(input: any, option: any) =>
            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          showArrow={true}
          options={[]}
          style={{ width: "100%" }}
        ></Select>
      </Col>
      <Col span={8}>
        <Input autoComplete="off" type={"text"} />
      </Col>
      <Col span={11} style={{ textAlign: "right" }}>
        <Button
          type="default"
          onClick={async () => {
            // if (request) {
            //   setLoading(true);
            //   await printTicket(
            //     request.expedienteId,
            //     request.solicitudId!,
            //     selectedPayments[0].id
            //   );
            //   setLoading(false);
            // }
          }}
        >
          Ticket
        </Button>
      </Col>
      <Col span={24}>
        <Descriptions
          labelStyle={{ width: "60%" }}
          className="request-description"
          bordered
          column={1}
          size="small"
        >
          <Descriptions.Item label="Concepto">Total</Descriptions.Item>
          <Descriptions.Item label="Estudio" className="number-desc">
            {moneyFormatter.format(totals.totalEstudios)}
          </Descriptions.Item>
          <Descriptions.Item label="Desc" className="number-desc">
            {moneyFormatter.format(totals.descuento)}
          </Descriptions.Item>
          <Descriptions.Item label="Cargo" className="number-desc">
            {moneyFormatter.format(totals.cargo)}
          </Descriptions.Item>
          <Descriptions.Item label="Copago" className="number-desc">
            {moneyFormatter.format(totals.copago)}
          </Descriptions.Item>
          <Descriptions.Item label="Total" className="number-desc">
            {moneyFormatter.format(totals.total)}
          </Descriptions.Item>
          <Descriptions.Item label="Saldo" className="number-desc">
            {moneyFormatter.format(totals.saldo)}
          </Descriptions.Item>
        </Descriptions>
      </Col>
    </Row>
  );
};

export default observer(RequestInvoice);
