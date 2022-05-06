import { Button, Divider, PageHeader, Table, } from "antd";
import React, { FC, Fragment, useEffect, useState, } from "react";
import {
  defaultPaginationProperties,
  getDefaultColumnProps,
  IColumns,
  ISearch,
} from "../../app/common/table/utils";
import useWindowDimensions, { resizeWidth } from "../../app/util/window";
import { EditOutlined } from "@ant-design/icons";
import IconButton from "../../app/common/button/IconButton";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ICompanyList } from "../../app/models/company";
import { useStore } from "../../app/stores/store";
import { observer } from "mobx-react-lite";
import { useReactToPrint } from "react-to-print";
import HeaderTitle from "../../app/common/header/HeaderTitle";


type CompanyTableProps = {
    componentRef: React.MutableRefObject<any>;
    printing: boolean;
  };
  
  
  const CompanyTable: FC<CompanyTableProps> = ({ componentRef, printing }) => {
    const { companyStore } = useStore();
    const { company, getAll } = companyStore;
  
    const [searchParams] = useSearchParams();
  
    let navigate = useNavigate();
  
    const { width: windowWidth } = useWindowDimensions();
  
    const [loading, setLoading] = useState(false);
  
    const [searchState, setSearchState] = useState<ISearch>({
      searchedText: "",
      searchedColumn: "",
    });
  
    console.log("Table");
  
    useEffect(() => {
      const readCompany = async () => {
        setLoading(true);
        await getAll(searchParams.get("search") ?? "all");
        setLoading(false);
      };
      readCompany();
    }, [getAll, searchParams]);
  
  
    const columns: IColumns<ICompanyList> = [
      {
        ...getDefaultColumnProps("clave", "Clave", {
          searchState,
          setSearchState,
          width: "8%",
          minWidth: 150,
          windowSize: windowWidth,
        }),
        render: (value, company) => (
          <Button
            type="link"
            onClick={() => {
              console.log(company);
              navigate(`/companies/${company.id}?${searchParams}&mode=readonly&search=${searchParams.get("search") ?? "all"}`);
            
            }}
            >
              {value}
          </Button>
        ),
      },
      {
        ...getDefaultColumnProps("contrasena", "Contraseña", {
          searchState,
          setSearchState,
          width: "16%",
          minWidth: 150,
          windowSize: windowWidth,
        }),
      },
      {
        ...getDefaultColumnProps("nombreComercial", "Nombre", {
          searchState,
          setSearchState,
          width: "12%",
          minWidth: 150,
          windowSize: windowWidth,
        }),
      },
     
      {
        ...getDefaultColumnProps("procedencia", "Procedencia", {
          searchState,
          setSearchState,
          width: "8%",
          minWidth: 150,
          windowSize: windowWidth,
        }),
      },
      {
        ...getDefaultColumnProps("listaPrecioId", "Precio", {
          searchState,
          setSearchState,
          width: "8%",
          minWidth: 150,
          windowSize: windowWidth,
        }),
      },
      // {
      //   ...getDefaultColumnProps( "ActivoDescripcion", "Activo", {
      //     searchState,
      //     setSearchState,
      //     width: "8%",
      //     minWidth: 150,
      //     windowSize: windowWidth,
          
      //   }),
      // },
      {
        key: "activo",
        dataIndex: "activo",
        title: "Activo",
        align: "center",
        width: windowWidth < resizeWidth ? 100 : "10%",
        render: (value) => (value ? "Sí" : "No"),
      },
      {
        key: "editar",
        dataIndex: "id",
        title: "Editar",
        align: "center",
        width: windowWidth < resizeWidth ? 100 : "6%",
        render: (value) => (
          <IconButton
            title="Editar Compañia"
            icon={<EditOutlined />}
            onClick={() => {
              navigate(`/companies/${value}?${searchParams}&mode=edit&search=${searchParams.get("search") ?? "all"}`);
            }}
            
          />
        ),
      },
    ];
  
    const CompanyTablePrint = () => {
      return (
        <div ref={componentRef}>
          <PageHeader
            ghost={false}
            title={<HeaderTitle title="Catálogo de Compañias" image="Company" />}
            className="header-container"
          ></PageHeader>
          <Divider className="header-divider" />
          <Table<ICompanyList>
            size="large"
            rowKey={(record) => record.id}
            columns={columns.slice(0, 6)}
            pagination={false}
            dataSource={[...company]}
          />
        </div>
      );
    };
  
    return (
      <Fragment>
        <Table<ICompanyList>
          loading={loading || printing}
          size="small"
          rowKey={(record) => record.id}
          columns={columns}
          dataSource={[...company]}
          pagination={defaultPaginationProperties}
          sticky
          scroll={{ x: windowWidth < resizeWidth ? "max-content" : "auto" }}
        />
        <div style={{ display: "none" }}>{<CompanyTablePrint />}</div>
      </Fragment>
    );
  }; 
  
  export default observer(CompanyTable);