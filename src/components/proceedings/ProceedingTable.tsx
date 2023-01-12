import {
  Button,
  Col,
  Collapse,
  Divider,
  Form,
  Input,
  PageHeader,
  Row,
  Table,
} from "antd";
import React, { FC, Fragment, useEffect, useState } from "react";
import {
  defaultPaginationProperties,
  getDefaultColumnProps,
  IColumns,
  ISearch,
} from "../../app/common/table/utils";
import useWindowDimensions, { resizeWidth } from "../../app/util/window";
import { EditOutlined } from "@ant-design/icons";
import IconButton from "../../app/common/button/IconButton";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useStore } from "../../app/stores/store";
import { observer } from "mobx-react-lite";
import HeaderTitle from "../../app/common/header/HeaderTitle";
import views from "../../app/util/view";
import {
  IProceedingList,
  ISearchMedical,
  SearchMedicalFormValues,
} from "../../app/models/Proceeding";

import DateRangeInput from "../../app/common/form/proposal/DateRangeInput";
import SelectInput from "../../app/common/form/proposal/SelectInput";
import TextInput from "../../app/common/form/proposal/TextInput";
import { formItemLayout } from "../../app/util/utils";
import { useForm } from "antd/lib/form/Form";
import DateInput from "../../app/common/form/proposal/DateInput";
import { IFormError, IOptions } from "../../app/models/shared";
import MaskInput from "../../app/common/form/proposal/MaskInput";
const { Panel } = Collapse;
type ProceedingTableProps = {
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
};

const ProceedingTable: FC<ProceedingTableProps> = ({
  componentRef,
  printing,
}) => {
  const { procedingStore, optionStore, locationStore } = useStore();
  const { expedientes, getAll, getnow, setSearch, search } = procedingStore;
  const { branchCityOptions,getBranchCityOptions } = optionStore;
  const { getCity } = locationStore;
  const [searchParams] = useSearchParams();
  const [errors, setErrors] = useState<IFormError[]>([]);
  let navigate = useNavigate();
  const [cityOptions, setCityOptions] = useState<IOptions[]>([]);
  const [branchOptions, setBranchOptions] = useState<IOptions[]>([]);

  const { width: windowWidth } = useWindowDimensions();
  const [form] = useForm();
  const [loading, setLoading] = useState(false);
  //const [searchFilter,SetSearchFilter] = useState<ISearchMedical>(new SearchMedicalFormValues())
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });
  const selectedCity = Form.useWatch("ciudad", form);
  useEffect(() => {
    setCityOptions(
      branchCityOptions.map((x) => ({ value: x.value, label: x.label }))
    );
  }, [branchCityOptions]);

  useEffect(() => {
    setBranchOptions(
      branchCityOptions.find((x) => x.value === selectedCity)?.options ?? []
    );
    form.setFieldValue("sucursal", []);
  }, [branchCityOptions, form, selectedCity]);
  console.log("Table");
  useEffect(() => {
    getBranchCityOptions();
  }, [getBranchCityOptions]);
  useEffect(() => {
    const readData = async () => {
      await getCity();
    };
    readData();
  }, [getCity]);
  useEffect(() => {
    const readPriceList = async () => {
      setLoading(true);
      await getnow(search!);
      setLoading(false);
    };

    if (expedientes.length === 0) {
      readPriceList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getnow]);
  const onfinish = async (values: ISearchMedical) => {
    console.log(values);
    if (values.fechaNacimiento === null) {
      delete values.fechaNacimiento;
    }
    setSearch(values);
    await getnow(values!);
  };
  const columns: IColumns<IProceedingList> = [
    {
      ...getDefaultColumnProps("expediente", "Expediente", {
        searchState,
        setSearchState,
        width: "15%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
      render: (value, Proceeding) => (
        <Button
          type="link"
          onClick={() => {
            navigate(
              `/${views.proceeding}/${Proceeding.id}?${searchParams}&mode=readonly`
            );
          }}
        >
          {value}
        </Button>
      ),
    },
    {
      ...getDefaultColumnProps("nomprePaciente", "Nombre del paciente", {
        searchState,
        setSearchState,
        width: "25%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("genero", "Sexo", {
        searchState,
        setSearchState,
        width: "5%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("edad", "Edad", {
        searchState,
        setSearchState,
        width: "5%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("fechaNacimiento", "Fecha de nacimiento", {
        searchState,
        setSearchState,
        width: "15%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("monederoElectronico", "Monedero electrónico", {
        searchState,
        setSearchState,
        width: "15%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("telefono", "Teléfono", {
        searchState,
        setSearchState,
        width: "10%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      key: "editar",
      dataIndex: "id",
      title: "Editar",
      align: "center",
      width: windowWidth < resizeWidth ? 100 : "10%",
      render: (value) => (
        <IconButton
          title="Editar Expediente"
          icon={<EditOutlined />}
          onClick={() => {
            navigate(`/${views.proceeding}/${value}?${searchParams}&mode=edit`);
          }}
        />
      ),
    },
  ];

  const PriceListTablePrint = () => {
    return (
      <div ref={componentRef}>
        <PageHeader
          ghost={false}
          title={<HeaderTitle title="Catálogo de Lista de Expedientes" />}
          className="header-container"
        ></PageHeader>
        <Divider className="header-divider" />
        <Table<IProceedingList>
          size="small"
          rowKey={(record) => record.id}
          columns={columns.slice(0, 7)}
          pagination={false}
          dataSource={[...expedientes]}
        />
      </div>
    );
  };

  return (
    <Fragment>
      <div className="status-container">
        <Form<ISearchMedical>
          {...formItemLayout}
          form={form}
          onFinish={onfinish}
          size="small"
          initialValues={new SearchMedicalFormValues()}
          onFinishFailed={({ errorFields }) => {
            const errors = errorFields.map((x) => ({
              name: x.name[0].toString(),
              errors: x.errors,
            }));
            setErrors(errors);
          }}
        >
          <Row justify="space-between" gutter={[0, 12]}>
            <Col span={8}>
              <TextInput
                formProps={{
                  name: "expediente",
                  label: "Expediente/Nombre",
                }}
              />
            </Col>
            <Col span={8}>
              <DateRangeInput
                formProps={{ label: "Fecha de alta", name: "fechaAlta" }}
                disableAfterDates={true}
              />
            </Col>
            <Col span={8}>
              <MaskInput
                formProps={{
                  name: "telefono",
                  label: "Teléfono",
                }}
                mask={[
                  /[0-9]/,
                  /[0-9]/,
                  /[0-9]/,
                  "-",
                  /[0-9]/,
                  /[0-9]/,
                  /[0-9]/,
                  "-",
                  /[0-9]/,
                  /[0-9]/,
                  "-",
                  /[0-9]/,
                  /[0-9]/,
                ]}
                validator={(_, value: any) => {
                  if (!value || value.indexOf("_") === -1) {
                    return Promise.resolve();
                  }
                  return Promise.reject("El campo debe contener 10 dígitos");
                }}
              />
            </Col>
            <Col span={8}>
              <DateInput
                formProps={{
                  label: "Fecha nacimiento",
                  name: "fechaNacimiento",
                }}
                disableAfterDates={true}
              />
            </Col>
            <Col span={8}>
            <Form.Item label="Sucursales" className="no-error-text" help="">
              <Input.Group>
                <Row gutter={8}>
                  <Col span={12}>
                    <SelectInput
                      formProps={{
                        name: "ciudad",
                        label: "Ciudad",
                        noStyle: true,
                      }}
                      options={cityOptions}
                    />
                  </Col>
                  <Col span={12}>
                    <SelectInput
                      form={form}
                      formProps={{
                        name: "sucursal",
                        label: "Sucursales",
                        noStyle: true,
                      }}
                      multiple
                      options={branchOptions}
                    />
                  </Col>
                </Row>
              </Input.Group>
            </Form.Item>
          </Col>
            <Col span={24} style={{ textAlign: "right" }}>
              <Button key="clean" htmlType="reset">
                Limpiar
              </Button>
              <Button key="filter" type="primary" htmlType="submit">
                Filtrar
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
      <br />
      <Table<IProceedingList>
        loading={loading || printing}
        size="small"
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={expedientes}
        pagination={defaultPaginationProperties}
        sticky
        scroll={{ x: windowWidth < resizeWidth ? "max-content" : "auto" }}
      />
      <div style={{ display: "none" }}>{<PriceListTablePrint />}</div>
    </Fragment>
  );
};
interface DescriptionItemProps {
  title: string;
  content: React.ReactNode;
  contentWidth?: string;
}
const DescriptionItem = ({
  title,
  content,
  contentWidth,
}: DescriptionItemProps) => (
  <div className="site-description-item-profile-wrapper">
    <p
      className="site-description-item-profile-p-label"
      style={{
        width: contentWidth
          ? (100 - Number(contentWidth.slice(0, -1))).toString() + "%"
          : "20%",
      }}
    >
      {title}:
    </p>
    <div
      className="site-description-item-profile-p-label"
      style={{ width: contentWidth ?? "80%" }}
    >
      {content}
    </div>
  </div>
);

export default observer(ProceedingTable);
