import { Spin, Form, Row, Col, Pagination, Button, PageHeader, Divider, Radio, DatePicker, List, Typography, Select, Table, Checkbox, Input, Tag, InputNumber } from "antd";
import React, { FC, useEffect, useState } from "react";
import { formItemLayout } from "../../../app/util/utils";
import TextInput from "../../../app/common/form/TextInput";
import { useStore } from "../../../app/stores/store";
import { IReagentForm, ReagentFormValues } from "../../../app/models/reagent";
import { useNavigate, useSearchParams } from "react-router-dom";
import ImageButton from "../../../app/common/button/ImageButton";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import { observer } from "mobx-react-lite";
import views from "../../../app/util/view";
import NumberInput from "../../../app/common/form/NumberInput";
import SelectInput from "../../../app/common/form/SelectInput";
import SwitchInput from "../../../app/common/form/SwitchInput";
import alerts from "../../../app/util/alerts";
import messages from "../../../app/util/messages";
import { getDefaultColumnProps, IColumns, ISearch } from "../../../app/common/table/utils";
import { IOptions } from "../../../app/models/shared";
import { ITaxForm, ITaxList } from "../../../app/models/taxdata";
import useWindowDimensions, { resizeWidth } from "../../../app/util/window";
import IconButton from "../../../app/common/button/IconButton";
import { EditOutlined } from "@ant-design/icons";
import { IProceedingForm } from "../../../app/models/Proceeding";
const DatosFiscalesForm = () => {
  const navigate = useNavigate();
  const { modalStore, procedingStore, locationStore } = useStore();
  const {setTax,tax}=procedingStore;
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [readonly, setReadonly] = useState(searchParams.get("mode") === "readonly");
  const [form] = Form.useForm<ITaxForm>();
  const [values, setValues] = useState();
  const [colonies, setColonies] = useState<IOptions[]>([]);
  const { getColoniesByZipCode } = locationStore;
  const goBack = () => {
    searchParams.delete("mode");
    setSearchParams(searchParams);
    navigate(`/${views.promo}?${searchParams}`);
  };
  const clearLocation = () => {
    form.setFieldsValue({
      estado: undefined,
      municipio: undefined,
      colonia: undefined,
    });
    setColonies([]);
  };

   useEffect(() => {
    console.log(tax, "taxlist");
  }, [tax]); 
  const setEditMode = () => {
    /*         navigate(`/${views.price}/${id}?${searchParams}&mode=edit`);
            setReadonly(false); */
  };
  const onValuesChange = async (changedValues: any) => {
    const field = Object.keys(changedValues)[0];

    if (field === "cp") {
      const zipCode = changedValues[field] as string;

      if (zipCode && zipCode.trim().length === 5) {
        const location = await getColoniesByZipCode(zipCode);
        if (location) {
          form.setFieldsValue({
            estado: location.estado,
            municipio: location.ciudad,
          });
          setColonies(
            location.colonias.map((x) => ({
              value: x.id,
              label: x.nombre,
            }))
          );
        } else {
          clearLocation();
        }
      } else {
        clearLocation();
      }
    }
  };
  const onFinish = async (newValues: ITaxForm) => {
    console.log(newValues, "values");
    setLoading(true);
    console.log(newValues, "values");
    var taxes: ITaxForm[] = tax == null ? [] : [...tax];

    if (newValues.id) {
      console.log("entro el if");
      var existing = taxes.findIndex(x => x.id == newValues.id);
      taxes[existing] = newValues;
    } else {
      taxes.push(newValues);
    }
    setTax(taxes);
    setLoading(false);

  };
  const { width: windowWidth } = useWindowDimensions();
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });
  const columnsEstudios: IColumns<ITaxForm> = [
    {
      ...getDefaultColumnProps("rfc", "RFC", {
        searchState,
        setSearchState,
        width: "10%",
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("razonSocial", "Razon Social", {
        searchState,
        setSearchState,
        width: "30%",
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("calle", "Dirección", {
        searchState,
        setSearchState,
        width: "30%",
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("correo", "Correo", {
        searchState,
        setSearchState,
        width: "30%",
        windowSize: windowWidth,
      }),
    },
    {
      key: "editar",
      dataIndex: "id",
      title: "Editar",
      align: "center",
      width: windowWidth < resizeWidth ? 100 : "20%",
      render: (value, item) => (
        <IconButton
          title="Editar lista de precio"
          icon={<EditOutlined />}
          onClick={() => {
            console.log(item, "el item");
            form.setFieldsValue(item);
            form.setFieldsValue({ id: item.id });
          }}
        />
      ),
    },
  ];
  return (
    <Spin spinning={loading}>
      <Row style={{ marginBottom: 14 }}>

        <Col md={24} sm={24} xs={12} style={{ textAlign: "right" }}>
          <Button onClick={goBack}>Cancelar</Button>
          <Button
            type="primary"
            htmlType="submit"
            onClick={() => {
              form.submit();
            }}
          >
            Añadir
          </Button>
        </Col>

      </Row>
      <div /* ref={componentRef} */>
        <Form<ITaxForm>
          {...formItemLayout}
          form={form}
          name="priceList"
          initialValues={values}
          onFinish={onFinish}
          scrollToFirstError
          onValuesChange={onValuesChange}
        >
          <Row>
            <TextInput
              formProps={{
                name: "id",
                label: "ID",
                style: { display: "none" }
              }}
              max={100}
 

            />
            <Col md={8} sm={24} xs={12}>
              <TextInput
                formProps={{
                  name: "rfc",
                  label: "RFC",
                }}
                max={100}
                required

              />
            </Col>
            <Col md={12} sm={24} xs={12}>
              <TextInput
                formProps={{
                  name: "razonSocial",
                  label: "Razon Social",
                }}
                max={100}
                required

              />
            </Col>
            <Col md={4} sm={24} xs={12}></Col>

            <Col md={6} sm={24} xs={12}>
              <TextInput
                formProps={{
                  name: "cp",
                  label: "CP",
                }}
                max={100}
              ></TextInput>
            </Col>
            <Col md={6} sm={24} xs={12}>
              <TextInput
                formProps={{
                  name: "estado",
                  label: "Estado",
                }}
                max={100}
                required

              />
            </Col>
            <Col md={6} sm={24} xs={12}>
              <TextInput
                formProps={{
                  name: "municipio",
                  label: "Municipio",
                }}
                max={100}
                required

              />
            </Col>
            <Col md={6} sm={24} xs={12}>
              <TextInput
                formProps={{
                  name: "correo",
                  label: "E-Mail",
                }}
                max={100}
              ></TextInput>
            </Col>
            <Col md={12} sm={24} xs={12}>
              <TextInput
                formProps={{
                  name: "calle",
                  label: "Calle y Número",
                }}
                required
                max={100}
              ></TextInput>
            </Col>
            <Col md={12} sm={24} xs={12}>
              <SelectInput
                formProps={{
                  name: "colonia",
                  label: "Colonia",
                }}
                required
                options={colonies}

              />
            </Col>
          </Row>
        </Form>
        <Table<ITaxForm>
          size="large"
          columns={columnsEstudios}
          pagination={false}
          rowKey={(item) => item.id}
          dataSource={[...(tax??[])]}
          scroll={{ x: windowWidth < resizeWidth ? "max-content" : "auto" }}
        />
      </div>
    </Spin>
  );
}

export default observer(DatosFiscalesForm);