import { PageHeader } from "antd";
import { observer } from "mobx-react-lite";
import { FC } from "react";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import DownloadIcon from "../../../app/common/icons/DownloadIcon";
import { useParams } from "react-router-dom";

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
  let { id, tipo } = useParams<UrlParams>();
  return (
    <>
      <PageHeader
        ghost
        title={
          <HeaderTitle
            title={
              tipo === "company"
                ? "Crédito y cobranza (Facturación por compañía)"
                : tipo === "request"
                ? "Crédito y cobranza (Facturación por solicitud)"
                : ""
            }
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
