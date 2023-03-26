import { Divider, List, Col, Select, Space } from "antd";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import ImageButton from "../../../app/common/button/ImageButton";
import { IOptions } from "../../../app/models/shared";
import { useStore } from "../../../app/stores/store";
import alerts from "../../../app/util/alerts";

type Props = {
  readonly: boolean;
  printing: boolean;
  selectedDoctors: string[];
  setSelectedDoctors: React.Dispatch<React.SetStateAction<string[]>>;
};

const PromotionFormDoctors = ({
  readonly,
  printing,
  selectedDoctors,
  setSelectedDoctors,
}: Props) => {
  const { optionStore } = useStore();
  const { medicOptions, getMedicOptions } = optionStore;

  const [value, setValue] = useState<string>();
  const [selected, setSelected] = useState<IOptions[]>([]);

  useEffect(() => {
    getMedicOptions();
  }, [getMedicOptions]);

  useEffect(() => {
    setSelected(
      medicOptions.filter((x) => selectedDoctors.includes(x.value.toString()))
    );
  }, [medicOptions, selectedDoctors]);

  const addDoctor = () => {
    if (!value) {
      alerts.warning("Por favor seleccione un médico");
      return;
    }

    setValue(undefined);
    setSelectedDoctors((prev) => [...prev, value]);
  };

  const deleteDoctor = (id: string) => {
    setSelectedDoctors((prev) => prev.filter((x) => x !== id));
  };

  const Header = () => {
    return (
      <Space>
        Médico:
        <Select
          style={{ width: 360 }}
          placeholder="Médico"
          options={medicOptions.filter(
            (x) => !selectedDoctors.includes(x.value.toString())
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
            onClick={addDoctor}
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
              onClick={() => deleteDoctor(item.value.toString())}
            />
          )}
        </Col>
      </List.Item>
    );
  };

  return (
    <div>
      <Divider orientation="left">Médicos</Divider>
      <List<IOptions>
        header={!readonly && <Header />}
        bordered
        dataSource={selected}
        renderItem={(item) => <RowRender item={item} />}
      />
    </div>
  );
};

export default observer(PromotionFormDoctors);
