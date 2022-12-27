import { Divider } from "antd";
import { observer } from "mobx-react-lite";
import InvoiceCompanyHeader from "../InvoiceCompanyHeader";
import InvoiceCompanyInfo from "./InvoiceCompanyInfo";

const InvoiceCompanyCreate = () => {
  return (
    <>
      <InvoiceCompanyHeader handleDownload={() => {}} />
      <Divider />
      <InvoiceCompanyInfo />
    </>
  );
};

export default observer(InvoiceCompanyCreate);
