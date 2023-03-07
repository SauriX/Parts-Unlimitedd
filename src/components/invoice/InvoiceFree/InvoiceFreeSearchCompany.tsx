import { Col, Row, Table } from "antd";
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import {
  getDefaultColumnProps,
  IColumns,
  ISearch,
} from "../../../app/common/table/utils";
import { ICompanyForm, ICompanyList } from "../../../app/models/company";
import { useStore } from "../../../app/stores/store";
import alerts from "../../../app/util/alerts";
import useWindowDimensions, { resizeWidth } from "../../../app/util/window";

type InvoiceFreeSearchCompany = {
  setSelectedCompany?: (company: ICompanyForm | undefined) => void;
};
const InvoiceFreeSearchCompany = ({
  setSelectedCompany,
}: InvoiceFreeSearchCompany) => {
  const { width: windowWidth } = useWindowDimensions();
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { companyStore } = useStore();
  const { company, getAll, getById } = companyStore;

  useEffect(() => {
    const loadCompanies = async () => {
      setIsLoading(true);
      await getAll("all");
      setIsLoading(false);
    };
    loadCompanies();
  }, []);

  const columns: IColumns<ICompanyList> = [
    {
      key: "clave",
      dataIndex: "clave",
      title: "Clave",
      align: "center",
      render: (value) => value,
    },
    {
      key: "nombreComercial",
      dataIndex: "nombreComercial",
      title: "Nombre",
      align: "center",
      render: (value) => value,
    },
    {
      key: "activo",
      dataIndex: "activo",
      title: "Activo",
      align: "center",
      render: (value) => (value ? "Sí" : "No"),
    },
    {
      key: "procedencia",
      dataIndex: "procedencia",
      title: "Procedencia",
      align: "center",
      render: (value) => value,
    },
  ];
  return (
    <>
      <Row>
        <Col span={24}>
          <Table
            loading={isLoading}
            rowKey={(row: any) => row.id}
            columns={columns}
            dataSource={company}
            bordered
            rowSelection={{
              type: "radio",
              selectedRowKeys: selectedRowKeys,
              onChange: async (newSelectedRowKeys: React.Key[]) => {
                setIsLoading(true);
                const companySelected = await getById(
                  "" + newSelectedRowKeys[0]
                );
                if (setSelectedCompany) {
                  setSelectedCompany(companySelected);
                }
                setSelectedRowKeys(newSelectedRowKeys);
                alerts.info("Compañía seleccionada");
                setIsLoading(false);
              },
            }}
          />
        </Col>
      </Row>
    </>
  );
};

export default observer(InvoiceFreeSearchCompany);
