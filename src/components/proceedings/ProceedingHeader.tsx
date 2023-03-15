import { Button, PageHeader } from "antd";
import { FC } from "react";
import HeaderTitle from "../../app/common/header/HeaderTitle";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useStore } from "../../app/stores/store";
import views from "../../app/util/view";
import PrintIcon from "../../app/common/icons/PrintIcon";
import DownloadIcon from "../../app/common/icons/DownloadIcon";
import { observer } from "mobx-react-lite";

type ProceedingProps = {
  handlePrint: () => void;
  handleDownload: () => Promise<void>;
};

const ProceedingHeader: FC<ProceedingProps> = ({
  handlePrint,
  handleDownload,
}) => {
  const {} = useStore();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <PageHeader
      ghost={false}
      title={<HeaderTitle title="Consulta de Expediente" image="expediente" />}
      className="header-container"
      extra={[
        /* scopes?.imprimir && */ <PrintIcon
          key="print"
          onClick={handlePrint}
        />,
        /* scopes?.descargar && */ <DownloadIcon
          key="doc"
          onClick={handleDownload}
        />,

        /* scopes?.crear &&  */ <Button
          key="new"
          type="primary"
          onClick={() => {
            navigate(`/${views.proceeding}/new?${searchParams}&mode=new`);
          }}
          icon={<PlusOutlined />}
        >
          Nuevo
        </Button>,
      ]}
    ></PageHeader>
  );
};

export default observer(ProceedingHeader);
