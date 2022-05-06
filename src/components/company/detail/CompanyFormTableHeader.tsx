import { Button, PageHeader, Input, Form, FormInstance } from "antd";
import React, { FC, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ContactFormValues, IContactForm } from "../../../app/models/contact";
import HeaderTitle from "../../../app/common/header/HeaderTitle";

const { Search } = Input;
//const contactos = contacts.filter(x => x.Nombre == value || x.activo == value || x.telefono == value);

type CompanyFormTableHeaderProps = {
  handleCompanyPrint: () => void;
  contacts: IContactForm[];
  setFilteredContacts: React.Dispatch<React.SetStateAction<IContactForm[]>>;
  formContact: FormInstance<IContactForm>;
};

const CompanyFormTableHeader: FC<CompanyFormTableHeaderProps> = ({
  handleCompanyPrint,
  formContact,
  contacts,
  setFilteredContacts,
}) => {
  // const contactos = ;
  // const navigate = useNavigate();

  // const [disabled, setDisabled] = useState(true);

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
          defaultValue={searchParams.get("search") ?? "all"}
          onSearch={(value) => {
            setFilteredContacts(
              contacts.filter(
                (x) =>
                  x.nombre.toLowerCase().includes(value.toLowerCase()) ||
                  x.telefono?.toString()?.includes(value)
              )
            );
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
          Agregar / Guardar
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
