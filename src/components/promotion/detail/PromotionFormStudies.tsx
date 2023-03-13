import {
  Divider,
  Row,
  Col,
  Table,
  InputNumber,
  DatePicker,
  Checkbox,
  FormInstance,
  Tag,
  Form,
} from "antd";
import { observer } from "mobx-react-lite";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { VList } from "virtual-table-ant-design";
import TextInput from "../../../app/common/form/proposal/TextInput";
import SelectInput from "../../../app/common/form/SelectInput";
import {
  getDefaultColumnProps,
  IColumns,
  ISearch,
} from "../../../app/common/table/utils";
import {
  IPromotionForm,
  IPromotionStudyPack,
} from "../../../app/models/promotion";
import { IDay } from "../../../app/models/shared";
import { useStore } from "../../../app/stores/store";
import { formItemLayout, moneyFormatter } from "../../../app/util/utils";

const { CheckableTag } = Tag;

const tagsData: IDay[] = [
  { id: 1, dia: "L", nombre: "lunes" },
  { id: 2, dia: "M", nombre: "martes" },
  { id: 3, dia: "M", nombre: "miercoles" },
  { id: 4, dia: "J", nombre: "jueves" },
  { id: 5, dia: "V", nombre: "viernes" },
  { id: 6, dia: "S", nombre: "sabado" },
  { id: 7, dia: "D", nombre: "domingo" },
];

// prettier-ignore
type days = "lunes" | "martes" | "miercoles" | "jueves" | "viernes" | "sabado" | "domingo";

type Props = {
  priceListId: string | undefined;
  form: FormInstance<IPromotionForm>;
  readonly: boolean;
  printing: boolean;
  studies: IPromotionStudyPack[];
  firstLoad: boolean;
  setStudies: React.Dispatch<React.SetStateAction<IPromotionStudyPack[]>>;
};

const PromotionFormStudies = ({
  priceListId,
  form,
  readonly,
  printing,
  firstLoad,
  studies,
  setStudies,
}: Props) => {
  const { promotionStore, optionStore } = useStore();
  const { getStudies } = promotionStore;
  const {
    areaOptions,
    departmentOptions,
    getAreaOptions,
    getDepartmentOptions,
  } = optionStore;

  const [filterForm] = Form.useForm();

  const departmentId = Form.useWatch("departamentoId", filterForm);
  const areaId = Form.useWatch("areaId", filterForm);
  const code = Form.useWatch("clave", filterForm);

  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });

  useEffect(() => {
    const readStudies = async () => {
      if (!priceListId || firstLoad) return;

      const filter = form.getFieldsValue();
      // prettier-ignore
      filter.fechaInicial = filter.fechaDescuento ? filter.fechaDescuento[0].utcOffset(0, false).toDate() : new Date();
      // prettier-ignore
      filter.fechaFinal = filter.fechaDescuento ? filter.fechaDescuento[1].utcOffset(0, false).toDate() : new Date();
      const studies = await getStudies(filter, false);
      setStudies(studies);
    };

    readStudies();
  }, [firstLoad, form, getStudies, priceListId, setStudies]);

  useEffect(() => {
    getDepartmentOptions();
  }, [getDepartmentOptions]);

  useEffect(() => {
    if (departmentId) getAreaOptions(departmentId);
  }, [departmentId, getAreaOptions]);

  const changeDiscountPercentage = (
    item: IPromotionStudyPack,
    discount: number
  ) => {
    const index = studies.findIndex(
      (x) => x.estudioId === item.estudioId && x.paqueteId === item.paqueteId
    );

    if (index === -1) return;

    const promoStudies = [...studies];
    const study = promoStudies[index];
    study.descuentoPorcentaje = Number(discount.toFixed(2));
    study.descuentoCantidad = Number(
      ((study.precio * discount) / 100).toFixed(2)
    );
    study.precioFinal = study.precio - study.descuentoCantidad;
    promoStudies[index] = study;

    setStudies(promoStudies);
  };

  const changeDiscountQty = (item: IPromotionStudyPack, discount: number) => {
    const index = studies.findIndex(
      (x) => x.estudioId === item.estudioId && x.paqueteId === item.paqueteId
    );

    if (index === -1) return;

    const promoStudies = [...studies];
    const study = promoStudies[index];
    study.descuentoCantidad = Number(discount.toFixed(2));
    study.descuentoPorcentaje = Number(
      ((discount * 100) / item.precio).toFixed(2)
    );
    study.precioFinal = study.precio - study.descuentoCantidad;
    promoStudies[index] = study;

    setStudies(promoStudies);
  };

  const changeDate = (item: IPromotionStudyPack, dates: moment.Moment[]) => {
    const index = studies.findIndex(
      (x) => x.estudioId === item.estudioId && x.paqueteId === item.paqueteId
    );

    if (index === -1) return;

    const promoStudies = [...studies];
    const study = promoStudies[index];
    study.fechaInicial = dates[0].utcOffset(0, false).toDate();
    study.fechaFinal = dates[1].utcOffset(0, false).toDate();
    promoStudies[index] = study;

    setStudies(promoStudies);
  };

  const changeEnabled = (item: IPromotionStudyPack, active: boolean) => {
    const index = studies.findIndex(
      (x) => x.estudioId === item.estudioId && x.paqueteId === item.paqueteId
    );

    if (index === -1) return;

    const promoStudies = [...studies];
    const study = promoStudies[index];
    study.activo = active;
    promoStudies[index] = study;

    setStudies(promoStudies);
  };

  const changeDays = (
    item: IPromotionStudyPack,
    day: string,
    value: boolean
  ) => {
    const index = studies.findIndex(
      (x) => x.estudioId === item.estudioId && x.paqueteId === item.paqueteId
    );

    if (index === -1) return;

    const promoStudies = [...studies];
    const study = promoStudies[index];
    study[day as days] = value;
    promoStudies[index] = study;

    setStudies(promoStudies);
  };

  const columns: IColumns<IPromotionStudyPack> = [
    {
      ...getDefaultColumnProps("clave", "Clave", {
        searchState,
        setSearchState,
        width: 100,
      }),
      fixed: "left",
    },
    {
      ...getDefaultColumnProps("nombre", "Nombre", {
        searchState,
        setSearchState,
        width: 200,
      }),
    },
    {
      key: "descuentoPorcentaje",
      dataIndex: "descuentoPorcentaje",
      title: "Desc %",
      align: "center",
      width: 100,
      render: (value, item) => (
        <InputNumber
          type={"number"}
          min={0}
          max={100}
          value={value}
          onChange={(value) => changeDiscountPercentage(item, value)}
          disabled={readonly}
        ></InputNumber>
      ),
    },
    {
      key: "descuentoCantidad",
      dataIndex: "descuentoCantidad",
      title: "Desc $",
      align: "center",
      width: 100,
      render: (value, item) => (
        <InputNumber
          type={"number"}
          min={0}
          max={item.precio}
          value={value}
          onChange={(value) => changeDiscountQty(item, value)}
          disabled={readonly}
        ></InputNumber>
      ),
    },
    {
      ...getDefaultColumnProps("precio", "Precio", {
        searchState,
        setSearchState,
        width: 100,
      }),
      render: (value) => moneyFormatter.format(value),
    },
    {
      ...getDefaultColumnProps("precioFinal", "Precio final", {
        searchState,
        setSearchState,
        width: 100,
      }),
      render: (value) => moneyFormatter.format(value),
    },
    {
      ...getDefaultColumnProps("area", "Área", {
        searchState,
        setSearchState,
        width: 100,
      }),
    },
    {
      key: "fecha",
      dataIndex: "fecha",
      title: "Fechas",
      align: "center",
      width: 200,
      render: (_value, item) => (
        <DatePicker.RangePicker
          value={[
            moment(item.fechaInicial).utcOffset(0, false),
            moment(item.fechaFinal).utcOffset(0, false),
          ]}
          format="DD/MM/YYYY"
          allowClear={false}
          onChange={(value) => {
            if (!value) return;
            changeDate(item, value as moment.Moment[]);
          }}
          disabled={readonly}
        />
      ),
    },
    {
      key: "activo",
      dataIndex: "activo",
      title: "Activo",
      align: "center",
      width: 100,
      render: (value, item) => (
        <Checkbox
          name="activo"
          checked={value}
          onChange={(e) => changeEnabled(item, e.target.checked)}
          className={readonly ? "unclickable" : ""}
        />
      ),
    },
    {
      key: "dias",
      dataIndex: "dias",
      title: "Dias",
      align: "center",
      width: 200,
      render: (value, item) => (
        <>
          {tagsData.map((tag) => (
            <CheckableTag
              key={tag.id}
              checked={item[tag.nombre! as days]}
              onChange={(value) => {
                if (readonly) return;
                changeDays(item, tag.nombre!, value);
              }}
              className={readonly ? "unclickable" : ""}
            >
              {tag.dia}
            </CheckableTag>
          ))}
        </>
      ),
    },
  ];

  return (
    <div>
      <Divider orientation="left">Estudios y paquetes</Divider>
      <Form {...formItemLayout} form={filterForm} name="filter">
        <Row>
          <Col span={8}>
            <SelectInput
              options={departmentOptions}
              placeholder={"Departamentos"}
              formProps={{
                name: "departamentoId",
                label: "Departamento",
              }}
            />
          </Col>
          <Col span={8}>
            <SelectInput
              options={!departmentId ? [] : areaOptions}
              placeholder={"Área"}
              formProps={{
                name: "areaId",
                label: "Área",
              }}
            />
          </Col>
          <Col span={8}>
            <TextInput formProps={{ name: "clave", label: "Buscar" }} />
          </Col>
        </Row>
      </Form>
      <Table<IPromotionStudyPack>
        size="small"
        rowKey={(record) =>
          record.tipo + "-" + record.estudioId ?? record.paqueteId
        }
        columns={columns}
        pagination={false}
        dataSource={studies.filter(
          (x) =>
            (x.departamentoId === departmentId || !departmentId) &&
            (x.areaId === areaId || !areaId) &&
            (x.clave.toLowerCase().includes(code?.toLowerCase()) ||
              x.nombre.toLowerCase().includes(code?.toLowerCase()) ||
              !code)
        )}
        components={VList({
          height: 500,
        })}
        scroll={{
          x: "max-content",
          y: 500,
        }}
      />
    </div>
  );
};

export default observer(PromotionFormStudies);
