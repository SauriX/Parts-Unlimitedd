import { Button, PageHeader, Select } from "antd";
import { observer } from "mobx-react-lite";
import { FC, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ImageButton from "../../app/common/button/ImageButton";
import { PlusOutlined } from "@ant-design/icons";
import HeaderTitle from "../../app/common/header/HeaderTitle";
import { IOptionsReport } from "../../app/models/shared";
import { useStore } from "../../app/stores/store";
import { reports } from "../../app/util/catalogs";
import "./css/index.css"

type ReportHeaderProps = {
    handlePrint: () => void;
    handleDownload: () => Promise<void>;
    report: IOptionsReport | undefined;
    setReport: React.Dispatch<React.SetStateAction<IOptionsReport | undefined>>;
};

const ReportHeader: FC<ReportHeaderProps> = ({report, setReport, handlePrint, handleDownload}) => {
    const { reportStore } = useStore();
    const { setCurrentReport, getAll } = reportStore;
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    
useEffect(() => {
    const name = searchParams.get("reports");
    if (name) {
      const reporte = reports.find((x) => x.value === name);
      setReport(reporte);
    }
  }, [searchParams, setReport]);

const handleChange = async (value: string) => {
    const selected = reports.find((x) => x.value === value);
    setReport(selected);
    setCurrentReport(selected?.value?.toString());

    if (selected) {
      searchParams.set("reports", selected.value.toString());
      //await getAll(selected.value.toString(), searchParams.get("search") ?? undefined);
    } else {
      searchParams.delete("reports");
    }

    setSearchParams(searchParams);
  };


    return (
        <PageHeader
            ghost={false}
            title={<HeaderTitle title="Reportes" image="rutas" />}
            className="header-container"
            extra={[
              // report && <ImageButton key="print" title="Imprimir" image="print" onClick={handlePrint} />,
              report && <ImageButton key="doc" title="Informe" image="doc" onClick={handleDownload} />,
                <Select
                  key="reports"
                  showSearch
                  placeholder="Reporte"
                  optionFilterProp="children"
                  defaultValue={searchParams.get("expediente")}
                  onChange={handleChange}
                  filterOption={(input: string, option: any) =>
                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  allowClear
                  style={{ width: 180, textAlign: "left" }}
                  options={reports}
                  ></Select>,
                  // <Button
                  // key="new"
                  // type="primary"
                  // onClick={() => {
                  //   navigate(`/reports/${searchParams}`);
                  // }}
                  // icon={<PlusOutlined />}
                  // disabled={!report}
                  // >
                  // Nuevo
                  // </Button>,
              ]}
        ></PageHeader>
        
    );
};

export default observer(ReportHeader);

