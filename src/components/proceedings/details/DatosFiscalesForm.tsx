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
const DatosFiscalesForm = ()=>{
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [readonly, setReadonly] = useState(searchParams.get("mode") === "readonly");
    const [form] = Form.useForm<ITaxForm>();
    const [values, setValues] = useState();
    
    const goBack = () => {
        searchParams.delete("mode");
        setSearchParams(searchParams);
        navigate(`/${views.promo}?${searchParams}`);
    };
    const setEditMode = () => {
/*         navigate(`/${views.price}/${id}?${searchParams}&mode=edit`);
        setReadonly(false); */
    };
    const onValuesChange = async (changedValues: any) => {
        const field = Object.keys(changedValues)[0];
    
        if (field === "idListaPrecios") { }
      };
    const onFinish = async (newValues: any) => {
        setLoading(true);
    
        //const reagent = { ...values, ...newValues }; 
        /*         console.log(reagent,"en el onfish")
                console.log(reagent); */
        let success = false;
    
        /*         if (!reagent.id) {
                  success = await create(reagent);
                } else {
                  success = await update(reagent);
                } */
    
        setLoading(false);
    
        if (success) {
          goBack();
        }
      };
      const { width: windowWidth } = useWindowDimensions();
      const [searchState, setSearchState] = useState<ISearch>({
        searchedText: "",
        searchedColumn: "",
      });
      const columnsEstudios: IColumns<ITaxList> = [
        {
          ...getDefaultColumnProps("clave", "RFC", {
            searchState,
            setSearchState,
            width: "10%",
            windowSize: windowWidth,
          }),
        },
        {
          ...getDefaultColumnProps("nombre", "Razon Social", {
            searchState,
            setSearchState,
            width: "30%",
            windowSize: windowWidth,
          }),
        },
        {
            ...getDefaultColumnProps("nombre", "Dirección", {
              searchState,
              setSearchState,
              width: "30%",
              windowSize: windowWidth,
            }),
        },
        {
          ...getDefaultColumnProps("area", "Correo", {
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
            render: (value) => (
              <IconButton
                title="Editar lista de precio"
                icon={<EditOutlined />}
                onClick={() => {
                  navigate(`/${views.price}/${value}?${searchParams}&mode=edit`);
                }}
              />
            ),
          },
      ];
    return (
        <Spin spinning={loading }>
          <Row style={{ marginBottom: 14 }}>
            {!readonly && (
              <Col md={ 24} sm={24} xs={12} style={{ textAlign: "right" }}>
                <Button onClick={goBack}>Cancelar</Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  onClick={() => {
                    form.submit();
                  }}
                >
                  Guardar
                </Button>
              </Col>
            )}
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
                  <Col md={12} sm={24} xs={12}>
                    <TextInput
                      formProps={{
                        name: "clave",
                        label: "RFC",
                      }}
                      max={100}
                      required
                      readonly={readonly}
                    />
                    </Col>
                    <Col md={12} sm={24} xs={12}>
                        <TextInput
                        formProps={{
                            name: "nombre",
                            label: "Razon Social",
                        }}
                        max={100}
                        required
                        readonly={readonly}
                        />
                    </Col>
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
                <SelectInput
                  formProps={{
                    name: "estado",
                    label: "Estado",
                  }}
                  options={[]}></SelectInput>
              </Col>
              <Col md={6} sm={24} xs={12}>
                <SelectInput
                  formProps={{
                    name: "municipio",
                    label: "Municipio",
                  }}
                  options={[]}></SelectInput>
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
                <TextInput
                  formProps={{
                    name: "colonia",
                    label: "Colonia",
                  }}
                  max={100}
                ></TextInput>
              </Col>
                </Row>
              </Form>
                  <Table<ITaxList>
                    size="large"
                    columns={columnsEstudios}
                    pagination={false}
                    dataSource={[]}
                    scroll={{ x: windowWidth < resizeWidth ? "max-content" : "auto" }}
                    />
            </div>
        </Spin>
      );
}

export default DatosFiscalesForm;