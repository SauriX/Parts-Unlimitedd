import { Spin, Form, Row, Col, Pagination, Button, PageHeader, Divider } from "antd";
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
import SwitchInput from "../../../app/common/form/SwitchInput";
import alerts from "../../../app/util/alerts";
import messages from "../../../app/util/messages";

type ReagentFormProps = {
  id: string;
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
};

const ReagentForm: FC<ReagentFormProps> = ({ id, componentRef, printing }) => {
  const { reagentStore } = useStore();
  const { reagents, getById, getAll, create, update } = reagentStore;

  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const [form] = Form.useForm<IReagentForm>();

  const [loading, setLoading] = useState(false);
  const [readonly, setReadonly] = useState(searchParams.get("mode") === "readonly");
  const [values, setValues] = useState<IReagentForm>(new ReagentFormValues());

  useEffect(() => {
    const readReagent = async (id: string) => {
      setLoading(true);
      const reagent = await getById(id);
      form.setFieldsValue(reagent!);
      setValues(reagent!);
      setLoading(false);
    };

    if (id) {
      readReagent(id);
    }
  }, [form, getById, id]);

  useEffect(() => {
    if (reagents.length === 0) {
      getAll(searchParams.get("search") ?? "all");
    }
  }, [getAll, reagents.length, searchParams]);

  const onFinish = async (newValues: IReagentForm) => {
    setLoading(true);

    const reagent = { ...values, ...newValues };

    let success = false;

    if (!reagent.id) {
      success = await create(reagent);
    } else {
      success = await update(reagent);
    }

    setLoading(false);

    if (success) {
      goBack();
    }
  };

  const goBack = () => {
    searchParams.delete("mode");
    setSearchParams(searchParams);
    navigate(`/${views.reagent}?${searchParams}`);
  };

  const setEditMode = () => {
    navigate(`/${views.reagent}/${id}?${searchParams}&mode=edit`);
    setReadonly(false);
  };

  const getPage = (id: string) => {
    return reagents.findIndex((x) => x.id === id) + 1;
  };

  const setPage = (page: number) => {
    const reagent = reagents[page - 1];
    navigate(`/${views.reagent}/${reagent.id}?${searchParams}`);
  };

  return (
    <Spin spinning={loading || printing} tip={printing ? "Imprimiendo" : ""}>
      <Row style={{ marginBottom: 24 }}>
        {!!id && (
          <Col md={12} sm={24} xs={12} style={{ textAlign: "left" }}>
            <Pagination
              size="small"
              total={reagents?.length ?? 0}
              pageSize={1}
              current={getPage(id)}
              onChange={setPage}
            />
          </Col>
        )}
        {!readonly && (
          <Col md={id ? 12 : 24} sm={24} xs={12} style={{ textAlign: "right" }}>
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
        {readonly && (
          <Col md={12} sm={24} xs={12} style={{ textAlign: "right" }}>
            <ImageButton key="edit" title="Editar" image="editar" onClick={setEditMode} />
          </Col>
        )}
      </Row>
      <div style={{ display: printing ? "" : "none", height: 300 }}></div>
      <div style={{ display: printing ? "none" : "" }}>
        <div ref={componentRef}>
          {printing && (
            <PageHeader
              ghost={false}
              title={<HeaderTitle title="Catálogo de Reactivos" image="reagent" />}
              className="header-container"
            ></PageHeader>
          )}
          {printing && <Divider className="header-divider" />}
          <Form<IReagentForm>
            {...formItemLayout}
            form={form}
            name="reagent"
            initialValues={values}
            onFinish={onFinish}
            scrollToFirstError
          >
            {(() => <></>) as any}
          </Form>
        </div>
      </div>
    </Spin>
  );
};

export default observer(ReagentForm);
