import { Descriptions, Radio, Typography, InputNumber } from "antd";
import { observer } from "mobx-react-lite";
import React from "react";
import { useStore } from "../../../app/stores/store";
import { moneyFormatter } from "../../../app/util/utils";

const { Text } = Typography;

const RequestInvoice = () => {
  const { requestStore } = useStore();
  const { totals, studies, packs, calculateTotals, setTotals } = requestStore;

  return (
    <Descriptions
      labelStyle={{ width: "60%" }}
      className="request-description"
      bordered
      column={1}
      size="small"
    >
      <Descriptions.Item label="Concepto">Total</Descriptions.Item>
      <Descriptions.Item label="Estudio">
        {moneyFormatter.format(totals.totalEstudios)}
      </Descriptions.Item>
      <Descriptions.Item
        label={
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Text>Desc</Text>
            <Radio.Group
              value={totals.descuentoTipo}
              onChange={(e) => {
                setTotals({ ...totals, descuentoTipo: e.target.value });
              }}
              className="request-radio"
            >
              <Radio value={1}>%</Radio>
              <Radio value={2}>$</Radio>
            </Radio.Group>
          </div>
        }
      >
        {totals.descuentoTipo === 1 ? (
          <InputNumber<number>
            key={"desc-per"}
            formatter={(value) => `${value}%`}
            parser={(value) => Number(value!.replace("%", ""))}
            value={totals.descuento}
            onChange={(value) => {
              setTotals({ ...totals, descuento: value });
            }}
            bordered={false}
            min={0}
            max={100}
          />
        ) : (
          <InputNumber<number>
            key={"desc-num"}
            formatter={(value) =>
              `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => Number(value!.replace(/\$ \s?|(,*)/g, ""))}
            value={totals.descuento}
            onChange={(value) => {
              setTotals({ ...totals, descuento: value });
            }}
            bordered={false}
            min={0}
            max={totals.totalEstudios}
          />
        )}
      </Descriptions.Item>
      <Descriptions.Item
        label={
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Text>Cargo</Text>
            <Radio.Group
              className="request-radio"
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
              setTotals({ ...totals, cargo: value });
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
              setTotals({ ...totals, cargo: value });
            }}
            bordered={false}
            min={0}
          />
        )}
      </Descriptions.Item>
      <Descriptions.Item
        label={
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Text>Copago</Text>
            <Radio.Group
              className="request-radio"
              value={totals.copagoTipo}
              onChange={(e) => {
                setTotals({ ...totals, copagoTipo: e.target.value });
              }}
            >
              <Radio value={1}>%</Radio>
              <Radio value={2}>$</Radio>
            </Radio.Group>
          </div>
        }
      >
        {totals.copagoTipo === 1 ? (
          <InputNumber<number>
            key={"cop-per"}
            formatter={(value) => `${value}%`}
            parser={(value) => Number(value!.replace("%", ""))}
            value={totals.copago}
            onChange={(value) => {
              setTotals({ ...totals, copago: value });
            }}
            bordered={false}
            min={0}
            max={100}
          />
        ) : (
          <InputNumber<number>
            key={"cop-num"}
            formatter={(value) =>
              `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => Number(value!.replace(/\$\s?|(,*)/g, ""))}
            value={totals.copago}
            onChange={(value) => {
              setTotals({ ...totals, copago: value });
            }}
            bordered={false}
            min={0}
            max={totals.totalEstudios}
          />
        )}
      </Descriptions.Item>
      <Descriptions.Item label="Total">
        {moneyFormatter.format(totals.total)}
      </Descriptions.Item>
      <Descriptions.Item label="Saldo">
        {moneyFormatter.format(totals.saldo)}
      </Descriptions.Item>
    </Descriptions>
  );
};

export default observer(RequestInvoice);
