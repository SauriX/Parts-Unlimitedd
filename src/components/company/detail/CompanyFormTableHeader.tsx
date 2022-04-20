import { Button, PageHeader, Input } from "antd";
import React, { FC } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";


const { Search } = Input;

type CompanyFormTableHeaderProps = {
  handleCompanyPrint: () => void;
};

const CompanyFormTableHeader: FC<CompanyFormTableHeaderProps> = ({ handleCompanyPrint, }) => {
  const navigate = useNavigate();



  const [searchParams, setSearchParams] = useSearchParams();

  console.log("Header");


  return (
    <PageHeader
      ghost={false}
      className="header-container"
      extra={[
        <Search
          key="search"
          placeholder="Buscar"
          defaultValue={searchParams.get("search") ?? ""}
          onSearch={(value) => {
            setSearchParams({ search: !value ? "all" : value });
          }}
        />,
        <Button
          key="new"
          type="primary"
          onClick={() => {
            navigate("/contact/0");
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