import { Col, Divider, Form, Input, Row } from "antd";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import SelectInput from "../../../app/common/form/SelectInput";
import { IRouteForm, RouteFormValues } from "../../../app/models/route";
import { useStore } from "../../../app/stores/store";

const { Search } = Input;

const RouteFormStudies = () => {
  const { optionStore, routeStore } = useStore();
  const { studies } = routeStore;
  const [lista, setLista] = useState(studies);
  const { departmentOptions, getAreaOptions: getareaOptions, areaOptions: areas } = optionStore;

  const [areaId, setAreaId] = useState<number>();
  const [depId, setDepId] = useState<number>();
  const [searchvalue, setSearchvalue] = useState<string>();
  const [values, setValues] = useState<IRouteForm>(new RouteFormValues());
  const [aeraSearch, setAreaSearch] = useState(areas);

  const filterByDepartament = async (departament: number) => {
    if (departament) {
      var departamento = departmentOptions.filter(
        (x) => x.value === departament
      )[0].label;
      var areaSearch = await getareaOptions(departament);
      var estudios = lista.filter((x) => x.departamento === departamento);
      setValues((prev) => ({ ...prev, estudio: estudios }));
      setAreaSearch(areaSearch!);
    } else {
      estudios = lista;
      if (estudios.length <= 0) {
        estudios = lista;
      }
      setValues((prev) => ({ ...prev, estudio: estudios }));
    }
  };

  const filterByArea = (area?: number) => {
    if (area) {
      var areaActive = areas.filter((x) => x.value === area)[0].label;
      var estudios = lista.filter((x) => x.area === areaActive);
      setValues((prev) => ({ ...prev, estudio: estudios }));
    } else {
      const dep = departmentOptions.find((x) => x.value === depId)?.label;
      estudios = lista.filter((x) => x.departamento === dep);
      setValues((prev) => ({ ...prev, estudio: estudios }));
    }
  };

  const filterBySearch = (search: string) => {
    var estudios = lista.filter(
      (x) => x.clave.includes(search) || x.nombre.includes(search)
    );
    setValues((prev) => ({ ...prev, estudio: estudios }));
  };

  return (
    <>
      <Divider orientation="left">Asignación de Estudios</Divider>
      <Row>
        <Col md={4} sm={24} xs={12}>
          <h3>Búsqueda por</h3>
        </Col>
      </Row>

      <Row justify="space-between" gutter={[8, 12]} align="middle">
        <Col md={8} sm={24} xs={12}>
          <SelectInput
            formProps={{
              name: "departamento",
              label: "Departamentos",
            }}
            options={departmentOptions}
            onChange={(value) => {
              setAreaId(undefined);
              setDepId(value);
              filterByDepartament(value);
            }}
            value={depId}
            placeholder={"Departamentos"}
          />
        </Col>
        <Col md={8} sm={24} xs={12}>
          <SelectInput
            formProps={{ name: "areaSearch", label: "Área" }}
            options={aeraSearch}
            onChange={(value) => {
              setAreaId(value);
              filterByArea(value);
            }}
            value={areaId}
            placeholder={"Área"}
          />
        </Col>
        <Col md={6} sm={24} xs={12}>
          <Form.Item name="search" label="" labelAlign="right">
            <Search
              key="search"
              placeholder="Buscar"
              onSearch={(value) => {
                filterBySearch(value);
                setSearchvalue(value);
              }}
              onChange={(value) => {
                setSearchvalue(value.target.value);
              }}
              value={searchvalue}
            />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};

export default observer(RouteFormStudies);
