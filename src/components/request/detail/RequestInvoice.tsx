import { Descriptions, Select, Row, Col, Input, Button } from "antd";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useStore } from "../../../app/stores/store";
import alerts from "../../../app/util/alerts";
import { moneyFormatter } from "../../../app/util/utils";

const RequestInvoice = () => {
  const { requestStore, optionStore } = useStore();
  const { request, totals, updateSeries, printTicket } = requestStore;
  const { receiptSeriesOptions, getReceiptSeriesOptions } = optionStore;

  useEffect(() => {
    if (request?.sucursalId) {
      console.log("SUCURSAL", request.sucursalId);
      getReceiptSeriesOptions(request.sucursalId);
    }
  }, [getReceiptSeriesOptions, request?.sucursalId]);

  const onSeriesChange = (value: string) => {
    alerts.confirm(
      "¿Desea actualizar la serie?",
      `Se cambiará la serie a ${value} y se actualizará el consecutivo`,
      async () => {
        if (!request) return;
        const req = { ...request };
        req.serie = value;
        await updateSeries(req);
      }
    );
  };

  const print = () => {
    if (request) {
      printTicket(request.expedienteId, request.solicitudId!);
    }
  };

  return (
    <Row gutter={[8, 12]} align="bottom">
      <Col span={6}>
        <div style={{ height: 24 }}>
          <label>Series</label>
        </div>
        <Select
          showSearch
          placeholder={"Serie"}
          optionFilterProp="children"
          filterOption={(input: any, option: any) =>
            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          value={request?.serie}
          showArrow={true}
          options={receiptSeriesOptions}
          style={{ width: "100%" }}
          onChange={onSeriesChange}
        ></Select>
      </Col>
      <Col span={7}>
        <Input
          autoComplete="off"
          type={"text"}
          value={request?.serieNumero}
          disabled
        />
      </Col>
      <Col span={11} style={{ textAlign: "right" }}>
        <Button type="default" onClick={print}>
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
