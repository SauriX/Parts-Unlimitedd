import { PageHeader, Button, Input, Select } from "antd";
import React, { FC, useEffect } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import ImageButton from "../../app/common/button/ImageButton";
import HeaderTitle from "../../app/common/header/HeaderTitle";
import { IOptionsCatalog } from "../../app/models/shared";
import { catalogs } from "../../app/util/catalogs";
import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";

const { Search } = Input;

type CatalogHeaderProps = {
  catalog: IOptionsCatalog | undefined;
  setCatalog: React.Dispatch<React.SetStateAction<IOptionsCatalog | undefined>>;
  handlePrint: () => void;
  handleDownload: () => Promise<void>;
};

const CatalogHeader: FC<CatalogHeaderProps> = ({ catalog, setCatalog, handlePrint, handleDownload }) => {
  const { catalogStore } = useStore();
  const { setCurrentCatalog, getAll } = catalogStore;

  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const name = searchParams.get("catalog");
    if (name) {
      const catalog = catalogs.find((x) => x.value === name);
      setCatalog(catalog);
    }
  }, [searchParams, setCatalog]);

  const handleChange = async (value: string) => {
    const selected = catalogs.find((x) => x.value === value);

    setCatalog(selected);
    setCurrentCatalog(selected?.value?.toString());

    if (selected) {
      searchParams.set("catalog", selected.value.toString());
      await getAll(selected.value.toString(), searchParams.get("search") ?? undefined);
    } else {
      searchParams.delete("catalog");
    }

    setSearchParams(searchParams);
  };

  const search = async (search: string | undefined) => {
    search = search === "" ? undefined : search;

    if (catalog) {
      await getAll(catalog.value.toString(), search ?? "all");
    }

    if (search) {
      searchParams.set("search", search);
    } else {
      searchParams.delete("search");
    }

    setSearchParams(searchParams);
  };

  return (
    <PageHeader
      ghost={false}
      title={<HeaderTitle title="Catálogo General" image="catalog" />}
      className="header-container"
      extra={[
        catalog && <ImageButton key="print" title="Imprimir" image="print" onClick={handlePrint} />,
        catalog && <ImageButton key="doc" title="Informe" image="doc" onClick={handleDownload} />,
        <Search
          key="search"
          placeholder="Buscar"
          defaultValue={searchParams.get("search") ?? ""}
          onSearch={search}
        />,
        <Select
          key="catalog"
          showSearch
          placeholder="Catálogo"
          optionFilterProp="children"
          defaultValue={searchParams.get("catalog")}
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
