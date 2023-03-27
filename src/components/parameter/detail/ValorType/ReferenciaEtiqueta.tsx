import { Row, Col, Button, Divider } from "antd";
import { useState } from "react";
import IconButton from "../../../../app/common/button/IconButton";
import { MinusCircleOutlined } from "@ant-design/icons";
import { observer } from "mobx-react-lite";
import TextInput from "../../../../app/common/form/TextInput";

const ReferenciaEtiqueta = () => {
  const [lista, setLista] = useState<any[]>([]);
  const addRow = () => {
    setLista((prev) => [
      ...prev,
      { id: prev.length, nombre: (prev.length + 1).toString() },
    ]);
  };
  const removeRow = (id: number) => {
    const list = lista.filter((x) => x.id !== id);
    setLista((prev) => list);
  };
  return (
    <div>
      <Divider orientation="left">
        Valores de referencia (Numérico con una columna):​
      </Divider>

      <Col md={24} sm={24} xs={24} style={{ marginLeft: "50%" }}>
        <Button onClick={() => {}} type="default">
          Modificar
        </Button>
        <Button type="primary" htmlType="submit" onClick={() => {}}>
          Guardar
        </Button>
      </Col>
      {lista.map((x) => (
        <Row key={x.nombre}>
          <Col md={12} sm={24} xs={12} style={{ marginTop: 20 }}>
            <TextInput
              formProps={{
                name: "clave" + x.nombre,
                label: "Clave",
              }}
              max={100}
            />
          </Col>
          <Col md={12} sm={24} xs={12} style={{ marginTop: 20 }}>
            <TextInput
              formProps={{
                name: "nombre" + x.nombre,
                label: "Nombre",
              }}
              max={100}
            />
          </Col>
          <Col md={6} sm={24} xs={12} style={{ marginTop: 22 }}>
            <IconButton
              title="Remover"
              icon={<MinusCircleOutlined />}
              onClick={() => removeRow(x.id)}
            />
          </Col>
        </Row>
      ))}
      <Button
        type="default"
        onClick={addRow}
        style={{ marginLeft: "50%", marginTop: 10 }}
      >
        Agregar
      </Button>
    </div>
  );
};
export default observer(ReferenciaEtiqueta);
