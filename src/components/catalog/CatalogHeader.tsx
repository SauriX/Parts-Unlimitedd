import { PageHeader, Button, Input, Select } from "antd";
import React, { FC } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import ImageButton from "../../app/common/button/ImageButton";
import HeaderTitle from "../../app/common/header/HeaderTitle";
import { IOptionsCatalog } from "../../app/models/shared";
import { catalogs } from "../../app/util/catalogs";
import { observer } from "mobx-react-lite";

const { Search } = Input;

type CatalogHeaderProps = {
  catalog: IOptionsCatalog | undefined;
  setCatalog: React.Dispatch<React.SetStateAction<IOptionsCatalog | undefined>>;
  handlePrint: () => void;
};

const CatalogHeader: FC<CatalogHeaderProps> = ({ catalog, setCatalog, handlePrint }) => {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  console.log("Header");

  const handleChange = (value: string) => {
    const selected = catalogs.find((x) => x.value === value);
    setCatalog(selected);
    if (selected) {
      searchParams.set("catalog", selected.value.toString());
    } else {
      searchParams.delete("catalog");
    }
    setSearchParams(searchParams);
  };

  return (
    <PageHeader
      ghost={false}
      title={<HeaderTitle title="Catálogo de Reactivos" image="reagent" />}
      className="header-container"
      extra={[
        <ImageButton key="print" title="Imprimir" image="print" onClick={handlePrint} />,
        <ImageButton key="doc" title="Informe" image="doc" />,
        <Search
          key="search"
          placeholder="Buscar"
          defaultValue={searchParams.get("search") ?? ""}
          onSearch={(value) => {
            setSearchParams({ search: !value ? "all" : value });
          }}
        />,
        <Select
          key="catalog"
          showSearch
          placeholder="Catálogo"
          optionFilterProp="children"
          onChange={handleChange}
          filterOption={(input: string, option: any) =>
            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          allowClear
          style={{ width: 180 }}
          options={catalogs}
        ></Select>,
        <Button
          key="new"
          type="primary"
          onClick={() => {
            navigate(`/catalogs/0?${searchParams}&mode=edit`);
          }}
          icon={<PlusOutlined />}
          disabled={!catalog}
        >
          Nuevo
        </Button>,
      ]}
    ></PageHeader>
  );
};

export default observer(CatalogHeader);
