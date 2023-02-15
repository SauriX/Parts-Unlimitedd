import { PageHeader } from "antd";
import { observer } from "mobx-react-lite";
import { FC } from "react";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import DownloadIcon from "../../../app/common/icons/DownloadIcon";
import { useParams, useNavigate } from "react-router-dom";
import GoBackIcon from "../../../app/common/icons/GoBackIcon";

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
        extra={[
          <DownloadIcon key="doc" onClick={handleDownload} />,
          <GoBackIcon
            key="back"
            onClick={() => {
              navigate(-1);
            }}
          />,
        ]}
      ></PageHeader>
    </>
  );
};
export default observer(InvoiceCompanyHeader);
