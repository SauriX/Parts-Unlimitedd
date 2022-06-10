import { Button, PageHeader, Input,  FormInstance } from "antd";
import React, { FC} from "react";
import {  useSearchParams } from "react-router-dom";
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
  handleCompanyPrint,
  formContact,
  contacts,
  setFilteredContacts,
}) => {
  // const contactos = ;
  // const navigate = useNavigate();

  // const [disabled, setDisabled] = useState(true);

  const [searchParams, ] = useSearchParams();
 

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
          // defaultValue={searchParams.get("search") ?? ""}
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
          Agregar
        </Button>,
      ]}
    ></PageHeader>
  );
};

export default CompanyFormTableHeader;
