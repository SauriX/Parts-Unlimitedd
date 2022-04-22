import { Button, PageHeader, Input, Form } from "antd";
import React, { FC, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import { IContactForm } from "../../../app/models/contact";
import HeaderTitle from "../../../app/common/header/HeaderTitle";

const { Search } = Input;


type CompanyFormTableHeaderProps = {
  handleCompanyPrint: () => void;
};

const CompanyFormTableHeader: FC<CompanyFormTableHeaderProps> = ({ handleCompanyPrint, }) => {
  const navigate = useNavigate();

  const [formContact] = Form.useForm<IContactForm>();
  const [disabled, setDisabled] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();

  console.log("Header");


  return (
    <PageHeader
    ghost={false}
      title={<HeaderTitle title="Contactos" image="doctor" />}
      className="header-container"
      extra={[
        
        <Search 
          style={{marginRight: 20, textAlign: "left" }}         
          key="search"
          placeholder="Buscar"
          defaultValue={searchParams.get("search") ?? ""}
          onSearch={(values) => {
            setSearchParams({ search: !values ? "all" : values });
          }}
         
        />,
          <Button
            style={{marginRight: 20, textAlign: "left" }}   
            type="primary"
            htmlType="submit"
            disabled={disabled}
            onClick={() => {
              formContact.submit();
              return;
            }}
          >
            Guardar
          </Button>
        ,
        
        <Button
          key="new"
          style={{marginRight: 1, textAlign: "right" }}   
          type="primary"
          onClick={() => {
            navigate("");
          }}
          icon={<PlusOutlined />}
        >
          Nuevo
        </Button>,
      ]}
    ></PageHeader>
  );
};

export default CompanyFormTableHeader;