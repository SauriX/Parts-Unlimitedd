import { Divider, List, Col, Select, Space } from "antd";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import PriceList from "../../../app/api/priceList";
import ImageButton from "../../../app/common/button/ImageButton";
import { IOptions } from "../../../app/models/shared";
import alerts from "../../../app/util/alerts";

type Props = {
  priceListId: string | undefined;
  readonly: boolean;
  printing: boolean;
  firstLoad: boolean;
  selectedBranches: string[];
  setSelectedBranches: React.Dispatch<React.SetStateAction<string[]>>;
};

const PromotionFormBranches = ({
  priceListId,
  readonly,
  printing,
  firstLoad,
  selectedBranches,
  setSelectedBranches,
}: Props) => {
  const [value, setValue] = useState<string>();
  const [branchOptions, setBranchOptions] = useState<IOptions[]>([]);
  const [selected, setSelected] = useState<IOptions[]>([]);

  useEffect(() => {
    const getBranches = async () => {
      if (!priceListId) {
        setBranchOptions([]);
        setValue(undefined);
        return;
      }
      if (!firstLoad) setSelectedBranches([]);

      try {
        const branches = await PriceList.getBranchesOptionsByPriceListId(
          priceListId
        );
        setBranchOptions(branches);
      } catch (error) {
        setBranchOptions([]);
      }
    };

    getBranches();
  }, [firstLoad, priceListId, setSelectedBranches]);

  useEffect(() => {
    setSelected(
      branchOptions.filter((x) => selectedBranches.includes(x.value.toString()))
    );
  }, [branchOptions, selectedBranches]);

  const addBranch = () => {
    if (!value) {
      alerts.warning("Por favor seleccione una sucursal");
      return;
    }

    setValue(undefined);
    setSelectedBranches((prev) => [...prev, value]);
  };

  const deleteBranch = (id: string) => {
    setSelectedBranches((prev) => prev.filter((x) => x !== id));
  };

  const Header = () => {
    return (
      <Space>
        Sucursal:
        <Select
          style={{ width: 360 }}
          placeholder="Sucursal"
          options={branchOptions.filter(
            (x) => !selectedBranches.includes(x.value.toString())
          )}
          allowClear
          value={value}
          onChange={(val) => setValue(val)}
        />
        {!readonly && !printing && (
          <ImageButton
            key="agregar"
            title="Agregar"
            image="agregar-archivo"
            onClick={addBranch}
          />
        )}
      </Space>
    );
  };

  const RowRender = ({ item }: { item: IOptions }) => {
    return (
      <List.Item>
        <Col md={12}>{item.label}</Col>
        <Col md={12} style={{ textAlign: "right" }}>
          {!readonly && !printing && (
            <ImageButton
              key="Eliminar"
              title="Eliminar"
              image="Eliminar_Clinica"
              onClick={() => deleteBranch(item.value.toString())}
            />
          )}
        </Col>
      </List.Item>
    );
  };

  return (
    <div>
      <Divider orientation="left">Sucursales</Divider>
      <List<IOptions>
        header={!readonly && <Header />}
        bordered
        dataSource={selected}
        renderItem={(item) => <RowRender item={item} />}
      />
    </div>
  );
};

export default observer(PromotionFormBranches);
