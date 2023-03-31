import { Button, PageHeader, Input, FormInstance } from "antd";
import React, { FC, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { IContactForm } from "../../../app/models/contact";
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
  formContact,
  contacts,
  setFilteredContacts,
}) => {
  const [searchValue, setSearchValue] = useState<string>("");

  useEffect(() => {
    setFilteredContacts(
      contacts.filter(
        (x) =>
          x.nombre.toLowerCase().includes(searchValue.toLowerCase()) ||
          x.telefono?.toString()?.includes(searchValue)
      )
    );
  }, [contacts, searchValue, setFilteredContacts]);

  return (
    <PageHeader
      ghost={false}
      title={<HeaderTitle title="Contactos" image="contacto" />}
      className="header-container"
      extra={[
        <Search
          style={{ marginRight: 20, textAlign: "left" }}
          key="search"
          placeholder="Buscar"
          value={searchValue}
          onSearch={(value) => {
            setSearchValue(value);
          }}
        />,
        <Button
          style={{ marginRight: 20, textAlign: "left" }}
          type="primary"
          htmlType="submit"
          onClick={() => {
            formContact.submit();
          }}
        >
          Agregar
        </Button>,
      ]}
    ></PageHeader>
  );
};

export default CompanyFormTableHeader;
