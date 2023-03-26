import { Divider } from "antd";
import { observer } from "mobx-react-lite";
import InvoiceCompanyForm from "../components/invoice/invoiceCompany/InvoiceCompanyForm";
import InvoiceCompanyHeader from "../components/invoice/invoiceCompany/InvoiceCompanyHeader";
import InvoiceCompanyTable from "../components/invoice/invoiceCompany/InvoiceCompanyTable";
import { useParams } from "react-router-dom";
import InvoiceFreeForm from "../components/invoice/InvoiceFree/InvoiceFreeForm";
import InvoiceFreeTable from "../components/invoice/InvoiceFree/InvoiceFreeTable";
import InvoiceGlobalForm from "../components/invoice/InvoiceGlobal/InvoiceGlobalForm";
import InvoiceGlobalTable from "../components/invoice/InvoiceGlobal/InvoiceGlobalTable";

const handleDownload = async () => {};
type UrlParams = {
  tipo: string;
};
const Invoice = () => {
  let { tipo } = useParams<UrlParams>();

  return (
    <>
      <InvoiceCompanyHeader
        handleDownload={handleDownload}
      ></InvoiceCompanyHeader>
      <Divider className="header-divider" />
      {tipo === "free" ? (
        <InvoiceFreeForm />
      ) : tipo === "global" ? (
        <InvoiceGlobalForm />
      ) : (
        <InvoiceCompanyForm />
      )}
      {tipo === "free" ? (
        <InvoiceFreeTable />
      ) : tipo === "global" ? (
        <InvoiceGlobalTable />
      ) : (
        <InvoiceCompanyTable />
      )}

      {/* {tipo === "global" ? <InvoiceFreeTable /> : <InvoiceCompanyTable />} */}
    </>
  );
};
export default observer(Invoice);
