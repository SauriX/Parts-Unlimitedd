import {
  Spin,
  Form,
  Row,
  Col,
  Pagination,
  Button,
  PageHeader,
  Divider,
  Table,
} from "antd";
import useWindowDimensions, { resizeWidth } from "../../../app/util/window";
import { IStudyList } from "../../../app/models/study";
import React, { FC, useEffect, useState } from "react";
import { formItemLayout } from "../../../app/util/utils";
import TextInput from "../../../app/common/form/TextInput";
import { useStore } from "../../../app/stores/store";
import { IReagentForm, ReagentFormValues } from "../../../app/models/reagent";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import ImageButton from "../../../app/common/button/ImageButton";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import { observer } from "mobx-react-lite";
import { IBranchForm,BranchFormValues } from "../../../app/models/branch";
import { ILocation } from "../../../app/models/location";
import { IOptions } from "../../../app/models/shared";
import NumberInput from "../../../app/common/form/NumberInput";
import SwitchInput from "../../../app/common/form/SwitchInput";
import SelectInput from "../../../app/common/form/SelectInput";
import alerts from "../../../app/util/alerts";
import messages from "../../../app/util/messages";
import { getDefaultColumnProps, IColumns, defaultPaginationProperties, ISearch } from "../../../app/common/table/utils";
type BranchFormProps = {

  componentRef: React.MutableRefObject<any>;
  printing: boolean;
};
type UrlParams = {
  id: string;
};
const BranchForm: FC<BranchFormProps> = ({ componentRef, printing }) => {
  const { locationStore } = useStore();
  const { getColoniesByZipCode } = locationStore;
  const [searchParams] = useSearchParams();
 
  const CheckReadOnly = () => {
    let result = false;
    const mode = searchParams.get("mode");
    if (mode == "ReadOnly") {
      result = true;
    }
    return result;
  }

  let { id } = useParams<UrlParams>();
  const navigate = useNavigate();
  const [form] = Form.useForm<IBranchForm>();

  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [colonies, setColonies] = useState<IOptions[]>([]);
  const [values, setValues] = useState<IBranchForm>(new BranchFormValues);

  const clearLocation = () => {
    form.setFieldsValue({
      estado: undefined,
      ciudad: undefined,
      coloniaId: undefined,
    });
    setColonies([]);
  };

  const onValuesChange = async (changedValues: any) => {
    const field = Object.keys(changedValues)[0];

    if (field === "codigoPostal") {
      const zipCode = changedValues[field] as string;

      if (zipCode && zipCode.trim().length === 5) {
        const location = await getColoniesByZipCode(zipCode);
        if (location) {
          form.setFieldsValue({
            estado: location.estado,
            ciudad: location.ciudad,
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
  console.log("Table");
  const { width: windowWidth } = useWindowDimensions();
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });
  
  const columns: IColumns<IStudyList> = [
    {
      ...getDefaultColumnProps("Id", "Id Estudio", {
        searchState,
        setSearchState,
        width: "30%",
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("nombre", "Estudio", {
        searchState,
        setSearchState,
        width: "30%",
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("areaId", "AreaId", {
        searchState,
        setSearchState,
        width: "30%",
        windowSize: windowWidth,
      }),
    },
  ];
  
  return (
    <Spin spinning={loading || printing} tip={printing ? "Imprimiendo" : ""}>
              <Row style={{ marginBottom: 24 }}>
          {id &&
            <Col md={12} sm={24} xs={12} style={{ textAlign: "left" }}>
              <Pagination size="small" total={/* roles.length */9} pageSize={1} current={/* actualUser() */4} onChange={(value) => { /* siguienteUser(value - 1) */ }} />
            </Col>
          }
          {!CheckReadOnly() &&
            <Col md={24} sm={24} xs={24} style={id ? { textAlign: "right" } : { marginLeft: "80%" }}>
              <Button onClick={() => { navigate(`/roles`); }} >Cancelar</Button>
              <Button type="primary" htmlType="submit" onClick={() => { form.submit() }}>
                Guardar
              </Button>
            </Col>
          }
          {
            CheckReadOnly() &&
            <Col md={12} sm={24} xs={12} style={{ textAlign: "right" }}>
              <ImageButton key="edit" title="Editar" image="editar" onClick={() => { navigate(`/sucursales/${id}?mode=edit&search=${searchParams.get("search") ?? "all"}`); }} />
            </Col>
          }
        </Row>
      <div style={{ display: printing ? "none" : "" }}>
        <div ref={componentRef}>
          {printing && (
            <PageHeader
              ghost={false}
              title={<HeaderTitle title="Sucursales" image="reagent" />}
              className="header-container"
            ></PageHeader>
          )}
          {printing && <Divider className="header-divider" />}
          <Form<IBranchForm>
            {...formItemLayout}
            form={form}
            name="branch"
            initialValues={values}
            onFinish={() => {}}
            scrollToFirstError
            onFieldsChange={() => {
              setDisabled(
                !form.isFieldsTouched() ||
                  form.getFieldsError().filter(({ errors }) => errors.length).length > 0
              );
            }}
            onValuesChange={onValuesChange}
          >
            <Row>
            <Col md={12} sm={24}>
              <TextInput
                formProps={{
                  name: "Clave",
                  label: "Clave",
                }}
                max={100}
                required
                readonly={CheckReadOnly()}
              />
            
              <TextInput
                formProps={{
                  name: "Nombre",
                  label: "Nombre",
                }}
                max={100}
                required
                readonly={CheckReadOnly()}
              />
                <TextInput
                  formProps={{
                    name: "codigoPostal",
                    label: "Codigo postal",
                  }}
                  max={100}
                  readonly={CheckReadOnly()}
                />
                <TextInput
                  formProps={{
                    name: "estado",
                    label: "Estado",
                  }}
                  max={100}
                  required
                  readonly={CheckReadOnly()}
                />
                <TextInput
                  formProps={{
                    name: "ciudad",
                    label: "Ciudad",
                  }}
                  max={100}
                  required
                  readonly={CheckReadOnly()}
                />
                <SelectInput
                  formProps={{
                    name: "coloniaId",
                    label: "Colonia",
                  }}
                  required
                  options={colonies}
                  readonly={CheckReadOnly()}
                />
                            <NumberInput
                  formProps={{
                    name: "NumeroExt",
                    label: "Número Exterior",
                  }}
                  max={9999999999}
                  min={1}
                  readonly={CheckReadOnly()}
                  required
                />
              <NumberInput
                  formProps={{
                    name: "NumeroInt",
                    label: "Número interior",
                  }}
                  max={9999999999}
                  min={1}
                  readonly={CheckReadOnly()}
                />
                <TextInput
                  formProps={{
                    name: "Calle",
                    label: "Calle",
                  }}
                  max={100}
                  required
                   readonly={CheckReadOnly()}
                />
                <SelectInput
                  formProps={{
                    name: "coloniaId",
                    label: "Colonia",
                  }}
                  required
                  readonly={CheckReadOnly()}
                  options={colonies}
                  />
                  </Col>
                  <Col md={12} sm={24} xs={12}>
                  <TextInput
                  formProps={{
                    name: "Correo",
                    label: "Correo",
                  }}
                  max={100}
                  required
                  readonly={CheckReadOnly()}
                  type="email"
                />
                <NumberInput
                  formProps={{
                    name: "Telefono",
                    label: "Teléfono",
                  }}
                  max={9999999999}
                  min={1111111111}
                  readonly={CheckReadOnly()}

                />
                <TextInput
                  formProps={{
                    name: "ClinicosId",
                    label: "Clinicos",
                  }}
                  max={100}
                  readonly={CheckReadOnly()}
                  required
                />
                <TextInput
                  formProps={{
                    name: "PresupuestosId",
                    label: "Presupuestos",
                  }}
                  max={100}
                  readonly={CheckReadOnly()}
                  required
                />
                <TextInput
                  formProps={{
                    name: "FacturaciónId",
                    label: "Facturacion",
                  }}
                  max={100}
                  readonly={CheckReadOnly()}
                  required
                />
                <SwitchInput
                  name="Activo"
                  onChange={(value) => {
                    if (value) {
                      alerts.info(messages.confirmations.enable);
                    } else {
                      alerts.info(messages.confirmations.disable);
                    }
                  }}
                  label="Activo"
                  readonly={CheckReadOnly()}
                />
              </Col>
            </Row>
          </Form>
        </div>
      </div>
      <Row>
    <Table<IStudyList>
          size="large"
          rowKey={(record) => record.id}
          columns={columns.slice(0, 3)}
          pagination={false}
          dataSource={[...(values.estudios??[])]}
          scroll={{ x: windowWidth < resizeWidth ? "max-content" : "auto" }}
        />
    </Row>
    </Spin>
  );
};

export default observer(BranchForm);
