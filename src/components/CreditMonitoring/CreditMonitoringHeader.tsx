import { Divider, PageHeader } from "antd";
import { observer } from "mobx-react-lite";
import { FC } from "react";

import { useNavigate } from "react-router-dom";
import HeaderTitle from "../../app/common/header/HeaderTitle";
import DownloadIcon from "../../app/common/icons/DownloadIcon";

type InvoiceCompanyHeaderProps = {
  handleDownload: () => void;
};
type UrlParams = {
  id: string;
  tipo: string;
};
const InvoiceCompanyHeader: FC<InvoiceCompanyHeaderProps> = ({
  handleDownload,
}) => {
  let navigate = useNavigate();

  return (
    <>
      <PageHeader
        ghost
        title={
          <HeaderTitle
            title={"Crédito y cobranza (Seguimiento facturas emitidas)"}
            image="invoice-company"
          />
        }
        onBack={() => {
          navigate(-1);
        }}
        className="header-container"
        extra={[<DownloadIcon key="doc" onClick={handleDownload} />]}
      ></PageHeader>
      <Divider className="header-divider"></Divider>
    </>
  );
};
export default observer(InvoiceCompanyHeader);
