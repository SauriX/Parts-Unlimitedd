import { Descriptions, Radio, Typography, InputNumber } from "antd";
import { observer } from "mobx-react-lite";
import React from "react";
import { useStore } from "../../../app/stores/store";
import { moneyFormatter } from "../../../app/util/utils";

const QuotationInvoice = () => {
  const { quotationStore } = useStore();
  const { totals } = quotationStore;

  return (
    <Descriptions
      labelStyle={{ width: "60%" }}
      className="quotation-description"
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
      <Descriptions.Item label="Total" className="number-desc">
        {moneyFormatter.format(totals.total)}
      </Descriptions.Item>
    </Descriptions>
  );
};

export default observer(QuotationInvoice);
