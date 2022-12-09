import { Divider } from "antd";
import { observer } from "mobx-react-lite";
import InvoiceCompanyForm from "../components/invoice/invoiceCompany/InvoiceCompanyForm";
import InvoiceCompanyHeader from "../components/invoice/invoiceCompany/InvoiceCompanyHeader";
import InvoiceCompanyTable from "../components/invoice/invoiceCompany/InvoiceCompanyTable";
const handleDownload = async () => {
  console.log("handleDownload");
};
const Invoice = () => {
  return (
    <>
      <InvoiceCompanyHeader
        handleDownload={handleDownload}
      ></InvoiceCompanyHeader>
      <Divider />
      <InvoiceCompanyForm />
      <Divider />
      <InvoiceCompanyTable />
    </>
  );
};
export default observer(Invoice);
