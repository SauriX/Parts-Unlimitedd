import { Button, PageHeader, Input, Form, FormInstance } from "antd";
import React, { FC, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import { IContactForm } from "../../../app/models/contact";
import HeaderTitle from "../../../app/common/header/HeaderTitle";

const { Search } = Input;

type CompanyFormTableHeaderProps = {
  handleCompanyPrint: () => void;

  formContact: FormInstance<IContactForm>;
};

const CompanyFormTableHeader: FC<CompanyFormTableHeaderProps> = ({
  handleCompanyPrint,
  formContact,
}) => {
  const navigate = useNavigate();

  const [disabled, setDisabled] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();

  console.log("Header");

  return (
    <PageHeader
      ghost={false}
      title={<HeaderTitle title="Contactos" image="contactos" />}
      className="header-container"
      extra={[
        <Search
          style={{ marginRight: 20, textAlign: "left" }}
          key="search"
          placeholder="Buscar"
          defaultValue={searchParams.get("search") ?? ""}
          onSearch={(              ) => {
            setSearchParams({      });
          }}
        />,
        <Button
          style={{ marginRight: 20, textAlign: "left" }}
          type="primary"
          htmlType="submit"
          // disabled={disabled}
          onClick={() => {
            formContact.submit();
            return;
          }}
        >
          Agregar/Editar
        </Button>,
        // <Button
        //   key="new"
        //   style={{ marginRight: 1, textAlign: "right" }}
        //   type="primary"
        //   onClick={() => {
        //     navigate("");
        //   }}
        //   icon={<PlusOutlined />}
        // >
        //   Nuevo
        // </Button>,
      ]}
    ></PageHeader>
  );
};

export default CompanyFormTableHeader;
