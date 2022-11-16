import { Descriptions, Radio, Typography, InputNumber } from "antd";
import { observer } from "mobx-react-lite";
import React from "react";
import { useStore } from "../../../app/stores/store";
import { moneyFormatter } from "../../../app/util/utils";

const { Text } = Typography;

const QuotationInvoice = () => {
  const { quotationStore } = useStore();
  const { totals, setTotals } = quotationStore;

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
      <Descriptions.Item
        label={
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Text>Cargo</Text>
            <Radio.Group
              className="quotation-radio"
              value={totals.cargoTipo}
              onChange={(e) => {
                setTotals({ ...totals, cargoTipo: e.target.value });
              }}
            >
              <Radio value={1}>%</Radio>
              <Radio value={2}>$</Radio>
            </Radio.Group>
          </div>
        }
      >
        {totals.cargoTipo === 1 ? (
          <InputNumber<number>
            key={"char-per"}
            formatter={(value) => `${value}%`}
            parser={(value) => Number(value!.replace("%", ""))}
            value={totals.cargo}
            onChange={(value) => {
              setTotals({ ...totals, cargo: value ?? 0 });
            }}
            bordered={false}
            min={0}
            max={100}
          />
        ) : (
          <InputNumber<number>
            key={"char-num"}
            formatter={(value) =>
              `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => Number(value!.replace(/\$\s?|(,*)/g, ""))}
            value={totals.cargo}
            onChange={(value) => {
              setTotals({ ...totals, cargo: value ?? 0 });
            }}
            bordered={false}
            min={0}
          />
        )}
      </Descriptions.Item>
      <Descriptions.Item label="Total" className="number-desc">
        {moneyFormatter.format(totals.total)}
      </Descriptions.Item>
    </Descriptions>
  );
};

export default observer(QuotationInvoice);
