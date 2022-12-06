import { PageHeader } from "antd";
import { observer } from "mobx-react-lite";
import { FC } from "react";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import DownloadIcon from "../../../app/common/icons/DownloadIcon";
type InvoiceCompanyHeaderProps = {
  handleDownload: () => void;
};
const InvoiceCompanyHeader: FC<InvoiceCompanyHeaderProps> = ({
  handleDownload,
}) => {
  return (
    <>
      <PageHeader
        ghost
        title={
          <HeaderTitle
            title="Crédito y cobranza (Facturación por compañía)"
            image="invoice-company"
          />
        }
        className="header-container"
        extra={[<DownloadIcon key="doc" onClick={handleDownload} />]}
      ></PageHeader>
    </>
  );
};
export default observer(InvoiceCompanyHeader);
